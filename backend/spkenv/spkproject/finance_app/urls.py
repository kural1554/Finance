from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AllDetailsViewSet

router = DefaultRouter()
router.register(r'all-details', AllDetailsViewSet, basename='all-details')

urlpatterns = [
    path('', include(router.urls)),
]
