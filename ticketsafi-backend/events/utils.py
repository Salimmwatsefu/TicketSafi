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
    Generates a smaller Dark Mode Ticket Image with QR on the right
    and credentials on the left. Optimized for file size.
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

    # 3. Draw Poster (smaller)
    if ticket.event.poster_image:
        try:
            with default_storage.open(ticket.event.poster_image.name) as f:
                poster = Image.open(f).convert("RGBA")
                aspect = poster.height / poster.width
                poster_h = int(ticket_width * aspect)
                if poster_h > 400:  # smaller max height
                    poster_h = 400
                poster = poster.resize((ticket_width, poster_h), Image.Resampling.BILINEAR)
                
                mask = create_rounded_rectangle_mask((ticket_width, poster_h), 20)
                draw_mask = ImageDraw.Draw(mask)
                draw_mask.rectangle((0, 20, ticket_width, poster_h), fill=255)
                
                img.paste(poster, (margin, current_y), mask=mask)
                current_y += poster_h + 20
        except Exception as e:
            print(f"Poster load error: {e}")
            current_y += 50
    else:
        current_y += 50

    # 4. Draw Body Background
    draw.rectangle([margin, current_y, width - margin, height - margin], fill=card_color)
    content_y = current_y + 30
    text_x = margin + 10

    # 5. Event Title
    draw.text((text_x, content_y), ticket.event.title, font=font_title, fill=text_white)
    content_y += 60

    # 6. Divider
    draw.line([(text_x, content_y), (width - text_x, content_y)], fill=accent_color, width=3)
    content_y += 30

    # 7. QR + Details side-by-side
    qr_size = 180
    qr_box_padding = 10
    qr_box_size = qr_size + qr_box_padding * 2
    qr_x = width - margin - qr_box_size
    qr_y = content_y

    draw.rounded_rectangle(
        (qr_x, qr_y, qr_x + qr_box_size, qr_y + qr_box_size),
        radius=15, fill=(255,255,255)
    )

    qr = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=6,
        border=0
    )
    qr.add_data(ticket.qr_code_hash)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white").resize((qr_size, qr_size))
    img.paste(qr_img, (qr_x + qr_box_padding, qr_y + qr_box_padding))

    # Draw ticket credentials on left side
    def draw_row(label, value, x, y, color=text_white):
        draw.text((x, y), label, font=font_label, fill=text_grey)
        draw.text((x, y + 28), str(value), font=font_value, fill=color)
        return y + 70

    left_x = margin + 10
    row_y = content_y
    date_str = ticket.event.start_datetime.strftime('%d %b %Y')
    time_str = ticket.event.start_datetime.strftime('%I:%M %p')
    row_y = draw_row("DATE & TIME", f"{date_str} • {time_str}", left_x, row_y)
    row_y = draw_row("LOCATION", ticket.event.location_name, left_x, row_y)
    row_y = draw_row("TICKET TYPE", ticket.tier.name, left_x, row_y)
    attendee = ticket.attendee_name or "Guest"
    if len(attendee) > 20: attendee = attendee[:18] + "..."
    row_y = draw_row("ATTENDEE", attendee, left_x, row_y)

    # Footer ID
    footer_y = max(row_y, qr_y + qr_box_size) + 20
    ticket_id = f"ID: {str(ticket.id).split('-')[0].upper()}"
    bbox = draw.textbbox((0,0), ticket_id, font=font_small)
    text_w = bbox[2] - bbox[0]
    draw.text(((width - text_w) / 2, footer_y), ticket_id, font=font_small, fill=text_grey)

    final_img = img.crop((0, 0, width, footer_y + 40))
    
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
    https://yadi.app
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
