from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.exceptions import ImmediateHttpResponse
from django.shortcuts import redirect
from django.conf import settings
from .models import User, OrganizerInvitationCode
import json

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        # 1. Check if user exists (Login logic)
        email = sociallogin.account.extra_data.get('email')
        if email:
            try:
                user = User.objects.get(email=email)
                if not sociallogin.is_existing:
                     sociallogin.connect(request, user)
                # Upgrade Guest Logic
                if getattr(user, 'is_guest', False):
                    user.is_guest = False
                    user.is_active = True
                    user.save()
                return
            except User.DoesNotExist:
                pass

    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        
        # --- 1. EXTRACT DATA (Prioritize URL Query Params) ---
        # Since we moved the code to the URL, request.GET is the most reliable place.
        data = request.GET.dict() # Get ?role=...&invitation_code=...
        
        # Fallback: Merge with JSON body if available (just in case)
        try:
            if hasattr(request, 'data') and isinstance(request.data, dict):
                data.update(request.data)
        except Exception:
            pass

        requested_role = data.get('role')
        # Clean the code (remove spaces)
        provided_code = data.get('invitation_code', '').strip() 
        
        print(f"DEBUG ADAPTER: Role={requested_role}, Code='{provided_code}'")

        # --- 2. VALIDATE & ASSIGN ROLE ---
        REUSABLE_CODES = ['YADI-ORG-1', 'YADI-ORG-2']

        if requested_role == 'ORGANIZER':
            # Check Hardcoded List
            if provided_code.upper() in REUSABLE_CODES:
                user.role = User.Role.ORGANIZER
            
            # Check Database List
            elif provided_code and OrganizerInvitationCode.objects.filter(code=provided_code, is_active=True).exists():
                user.role = User.Role.ORGANIZER
            
            else:
                # Security Fallback
                print(f"WARNING: Invalid/Missing Code '{provided_code}' for Organizer request. Defaulting to Attendee.")
                user.role = User.Role.ATTENDEE
        else:
            user.role = User.Role.ATTENDEE
        
        user.is_guest = False
        user.is_active = True
        user.save()
        
        return user