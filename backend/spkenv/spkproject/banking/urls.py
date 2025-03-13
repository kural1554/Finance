from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BankDetailsViewSet

router = DefaultRouter()
router.register(r'bank-details', BankDetailsViewSet)  # This will handle /api/bank-details/

urlpatterns = [
    path('', include(router.urls)),  # No need for 'api/' here
]
