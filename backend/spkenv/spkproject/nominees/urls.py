from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NomineeViewSet

router = DefaultRouter()
router.register(r'nominees', NomineeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
