from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoanApplicationViewSet

router = DefaultRouter()
router.register(r'loan-applications', LoanApplicationViewSet, basename='loan-application')

urlpatterns = [
    path('', include(router.urls)),
]






