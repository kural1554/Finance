from django.urls import path, include
from .views import UserRegisterView, UserLoginView

urlpatterns = [
    path('auth/register/', UserRegisterView.as_view(), name='register'),
    path('auth/login/', UserLoginView.as_view(), name='login'),
    # path('auth/profile/', UserProfileView.as_view(), name='profile'),
]
