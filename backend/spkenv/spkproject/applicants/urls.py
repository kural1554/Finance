from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApplicantViewSet, validate_applicant, update_applicant, delete_applicant, restore_applicant,partial_update_applicant  # ✅ Add the restore view

# Initialize the router for ApplicantViewSet
router = DefaultRouter()
router.register(r'applicants', ApplicantViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Includes all the default routes for the ApplicantViewSet (CRUD operations)
    path('validate-applicant/', validate_applicant, name='validate-applicant'),  # Endpoint to validate an applicant
    path('update-applicant/<int:applicant_id>/', update_applicant, name='update_applicant'),  # Endpoint to update an applicant by ID
    path('delete-applicant/<int:applicant_id>/', delete_applicant, name='delete_applicant'),  # Endpoint to soft delete an applicant by ID
    path('restore-applicant/<int:applicant_id>/', restore_applicant, name='restore_applicant'),
    path('patch-applicant/<int:applicant_id>/', partial_update_applicant, name='patch_applicant'),
]
