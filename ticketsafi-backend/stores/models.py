import uuid
from django.db import models
from events.models import User 

# --- 1. Store (Organizer Microsite) ---
class Store(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # CHANGED: OneToOneField -> ForeignKey to allow multiple stores per user
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stores')
    
    name = models.CharField(max_length=255) # Removed unique=True to allow similar names if needed, or keep it unique globally
    slug = models.SlugField(max_length=255, unique=True, help_text="URL-friendly name")
    description = models.TextField(blank=True)
    
    logo_image = models.ImageField(upload_to='store_logos/', blank=True, null=True)
    banner_image = models.ImageField(upload_to='store_banners/', blank=True, null=True)
    
    instagram_link = models.URLField(blank=True, null=True)
    website_link = models.URLField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name