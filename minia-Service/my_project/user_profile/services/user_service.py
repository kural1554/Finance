from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError

class UserService:
    @staticmethod
    def create_user(username, email, password):
        if User.objects.filter(username=username).exists():
            raise ValidationError("Username already exists")
        
        user = User.objects.create_user(username=username, email=email, password=password)
        return user

    @staticmethod
    def authenticate_user(username, password):
        from django.contrib.auth import authenticate
        user = authenticate(username=username, password=password)
        if not user:
            raise ValidationError("Invalid credentials")
        return user
