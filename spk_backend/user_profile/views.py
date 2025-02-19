from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .services.user_service import UserService
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie


@method_decorator(csrf_exempt, name='dispatch')  # ✅ Correct way to disable CSRF for class-based views
class UserRegisterView(APIView):
    def post(self, request):
        data = request.data
        user = UserService.create_user(data.get("username"), data.get("email"), data.get("password"))
        if user:
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response({"error": "User creation failed"}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class UserLoginView(APIView):
    def post(self, request):
        data = request.data
        user = UserService.authenticate_user(data.get("username"), data.get("password"))
        if user:
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
