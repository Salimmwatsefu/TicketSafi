from django.conf import settings
import qrcode
from io import BytesIO
from django.core.mail import EmailMessage
from django.core.files.storage import default_storage
from PIL import Image, ImageDraw, ImageFont

def create_rounded_rectangle_mask(size, radius):
    """Helper to create a rounded rectangle mask for images"""
    factor = 2  # Supersample for smooth corners
    width, height = size
    mask = Image.new('L', (width * factor, height * factor), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, width * factor, height * factor), radius * factor, fill=255)
    return mask.resize(size, Image.Resampling.LANCZOS)

def generate_ticket_image(ticket):
    """
    Generates a Dark Mode Ticket Image with a LARGER QR code for easy scanning.
    """
    # 1. Setup Canvas
    width = 600
    height = 1200
    
    background_color = (9, 9, 11)
    card_color = (24, 24, 27)
    text_white = (255, 255, 255)
    text_grey = (161, 161, 170)
    accent_color = (236, 72, 153)
    
    img = Image.new('RGB', (width, height), background_color)
    draw = ImageDraw.Draw(img)

    # 2. Load Fonts
    try:
        font_title = ImageFont.truetype("arialbd.ttf", 40)
        font_label = ImageFont.truetype("arial.ttf", 20)
        font_value = ImageFont.truetype("arialbd.ttf", 26)
        font_small = ImageFont.truetype("arial.ttf", 16)
    except IOError:
        font_title = ImageFont.load_default()
        font_label = ImageFont.load_default()
        font_value = ImageFont.load_default()
        font_small = ImageFont.load_default()

    margin = 30
    ticket_width = width - (margin * 2)
    current_y = margin

    # 3. Draw Poster
    if ticket.event.poster_image:
        try:
            with default_storage.open(ticket.event.poster_image.name) as f:
                poster = Image.open(f).convert("RGBA")
                aspect = poster.height / poster.width
                poster_h = int(ticket_width * aspect)
                if poster_h > 450:  # Allow slightly taller posters
                    poster_h = 450
                poster = poster.resize((ticket_width, poster_h), Image.Resampling.BILINEAR)
                
                # Create mask for rounded corners
                mask = create_rounded_rectangle_mask((ticket_width, poster_h), 20)
                # Ensure bottom corners are square if merging with body, but here we keep floating style
                
                img.paste(poster, (margin, current_y), mask=mask)
                current_y += poster_h + 20
        except Exception as e:
            print(f"Poster load error: {e}")
            current_y += 50
    else:
        current_y += 50

    # 4. Draw Body Background (Start below poster)
    body_start_y = current_y
    draw.rectangle([margin, body_start_y, width - margin, height - margin], fill=card_color)
    content_y = body_start_y + 30
    text_x = margin + 20

    # 5. Event Title
    draw.text((text_x, content_y), ticket.event.title, font=font_title, fill=text_white)
    content_y += 60

    # 6. Divider
    draw.line([(text_x, content_y), (width - text_x, content_y)], fill=accent_color, width=3)
    content_y += 40

    # --- 7. LARGE QR CODE (Centered for visibility) ---
    # Increased size from 180 to 280
    qr_size = 280 
    qr_box_padding = 15
    qr_box_size = qr_size + qr_box_padding * 2
    
    # Center the QR code horizontally
    qr_x = (width - qr_box_size) // 2
    qr_y = content_y

    # White background box for QR
    draw.rounded_rectangle(
        (qr_x, qr_y, qr_x + qr_box_size, qr_y + qr_box_size),
        radius=15, fill=(255,255,255)
    )

    qr = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10, # Increased box size for better resolution
        border=0
    )
    qr.add_data(ticket.qr_code_hash)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white").resize((qr_size, qr_size))
    img.paste(qr_img, (qr_x + qr_box_padding, qr_y + qr_box_padding))
    
    content_y = qr_y + qr_box_size + 40 # Move content below QR

    # --- 8. Ticket Details (Below QR) ---
    def draw_row_centered(label, value, y, color=text_white):
        # Calculate center position for text
        bbox_label = draw.textbbox((0,0), label, font=font_label)
        label_w = bbox_label[2] - bbox_label[0]
        
        bbox_val = draw.textbbox((0,0), str(value), font=font_value)
        val_w = bbox_val[2] - bbox_val[0]
        
        draw.text(((width - label_w) / 2, y), label, font=font_label, fill=text_grey)
        draw.text(((width - val_w) / 2, y + 28), str(value), font=font_value, fill=color)
        return y + 70

    row_y = content_y
    date_str = ticket.event.start_datetime.strftime('%d %b %Y')
    time_str = ticket.event.start_datetime.strftime('%I:%M %p')
    
    row_y = draw_row_centered("DATE & TIME", f"{date_str} • {time_str}", row_y)
    row_y = draw_row_centered("LOCATION", ticket.event.location_name, row_y)
    
    # Attendee and Type side-by-side if space allows, or stacked
    row_y = draw_row_centered("TICKET TYPE", ticket.tier.name, row_y, color=accent_color)
    
    attendee = ticket.attendee_name or "Guest"
    if len(attendee) > 25: attendee = attendee[:22] + "..."
    row_y = draw_row_centered("ATTENDEE", attendee, row_y)

    # Footer ID
    footer_y = row_y + 30
    ticket_id = f"ID: {str(ticket.id).split('-')[0].upper()}"
    bbox = draw.textbbox((0,0), ticket_id, font=font_small)
    text_w = bbox[2] - bbox[0]
    draw.text(((width - text_w) / 2, footer_y), ticket_id, font=font_small, fill=text_grey)

    final_img = img.crop((0, 0, width, footer_y + 50))
    
    buffer = BytesIO()
    final_img.save(buffer, format="PNG", optimize=True)
    return buffer.getvalue()


def send_ticket_email(ticket):
    """
    Sends email with the generated Ticket Image attached.
    """
    subject = f"Your Ticket: {ticket.event.title} | Yadi Tickets"
    
    try:
        ticket_image_data = generate_ticket_image(ticket)
    except Exception as e:
        print(f"Failed to generate ticket image: {e}")
        ticket_image_data = None

    body = f"""
    Jambo {ticket.attendee_name},
    
    Thank you for purchasing a ticket for {ticket.event.title}.
    
    Please find your official ticket attached to this email.
    You can save this image to your phone and scan it at the gate.
    
    Enjoy the event!
    Yadi Tickets Team
    https://tickets.yadi.app
    """

    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[ticket.attendee_email or ticket.owner.email],
    )
    
    if ticket_image_data:
        filename = f"Ticket-{ticket.event.title[:10].replace(' ', '_')}-{str(ticket.id)[:4]}.png"
        email.attach(filename, ticket_image_data, 'image/png')
    
    email.send()
