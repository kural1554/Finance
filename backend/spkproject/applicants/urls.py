

from django.urls import path, include
from rest_framework.routers import DefaultRouter


from .views import ApplicantViewSet, validate_applicant_view

router = DefaultRouter()
router.register(r'applicants', ApplicantViewSet, basename='applicant')

urlpatterns = [

    path('', include(router.urls)),
    path('validate-applicant/', validate_applicant_view, name='validate-applicant'),

    ]

