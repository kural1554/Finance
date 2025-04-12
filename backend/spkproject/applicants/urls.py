from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApplicantViewSet, validate_applicant

router = DefaultRouter()
router.register(r'applicants', ApplicantViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('validate-applicant/', validate_applicant, name='validate-applicant'),
]
