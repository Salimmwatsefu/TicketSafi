from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        # 1. Let the default adapter create the user and populate basic info (email, name)
        user = super().save_user(request, sociallogin, form)

        # 2. Check if 'role' was sent in the request body
        # (This comes from the frontend axios call)
        data = request.data
        requested_role = data.get('role')

        # 3. If it's a valid role, assign it to the new user
        if requested_role in ['ORGANIZER', 'ATTENDEE']:
            user.role = requested_role
            user.save()
            print(f"✅ Google Sign-Up: Created user {user.email} as {user.role}")
        
        return user