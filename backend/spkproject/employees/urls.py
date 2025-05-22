# employees/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserCreationViewSet, MyEmployeeProfileViewSet,EmployeeDetailsViewSet # Add EmployeeProfileViewSet if using

router = DefaultRouter()
router.register(r'user-creation', UserCreationViewSet, basename='user-creation') # Renamed from 'users'
router.register(r'my-profile', MyEmployeeProfileViewSet, basename='my-employee-profile')
router.register(r'manage-profiles', EmployeeDetailsViewSet, basename='manage-employee-profiles')
urlpatterns = [
    path('', include(router.urls)),
    
]