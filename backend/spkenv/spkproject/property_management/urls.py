from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyDetailsViewSet

router = DefaultRouter()
router.register(r'property-details', PropertyDetailsViewSet)  # This will handle /api/bank-details/

urlpatterns = [
    path('', include(router.urls)),  # No need for 'api/' here
]



