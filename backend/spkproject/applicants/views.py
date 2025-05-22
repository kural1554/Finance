from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import ValidationError, PermissionDenied, NotAuthenticated
from rest_framework.decorators import action, api_view, permission_classes
from django.db import transaction # Not strictly used in the visible parts, but good to keep if other parts need it
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User, Group # User is used in user_profile_view
import logging

from .models import Applicant
from .serializers import ApplicantSerializer
# Import your specific permission classes from core.permissions
from core.permissions import (
    IsAdminUser,
    IsManagerUser, # Not directly used in ViewSet get_permissions but IsStaffUser and others might use it
    IsStaffUser,   # Not directly used in ViewSet get_permissions but others might use it
    CanCreateUpdateApplicant,
    CanViewApplicantListAndDetails,
    CanDeleteRestoreApplicant
)

logger = logging.getLogger(__name__)


class ApplicantViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicantSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated] # Default, overridden by get_permissions

    # ***** MIKAVUM MUKKIYAMAANA MAATRAM INGU *****
    lookup_field = 'userID' # userID vechi thedanum nu sollrom

    def get_queryset(self):
        """
        'list' action ku default manager (ActiveApplicantsManager) use aagum.
        Matha actions (retrieve, update, etc.) ku 'all_objects' manager use aagum.
        Idhu soft-deleted applicants ah kuda retrieve/update panna help pannum.
        """
        if self.action == 'list':
            # queryset = Applicant.objects.all().order_by('-loanreg_date') # Pazhaya line
            return Applicant.objects.all().order_by('-loanreg_date') # Default manager (Active)
        else:
            # For retrieve, update, partial_update, destroy actions
            return Applicant.all_objects.all().order_by('-loanreg_date') # All objects (including soft-deleted)


    def get_permissions(self):
        """
        Assigns permissions based on the action.
        """
        # Admin > Manager > Staff hierarchy unga core.permissions la define aayirukkanum
        if self.action in ['create', 'update', 'partial_update']:
            self.permission_classes = [IsAuthenticated, CanCreateUpdateApplicant]
        elif self.action in ['list', 'retrieve']:
            self.permission_classes = [IsAuthenticated, CanViewApplicantListAndDetails]
        elif self.action in ['destroy', 'restore_applicant']: # destroy is a default action, restore_applicant is custom
            self.permission_classes = [IsAuthenticated, CanDeleteRestoreApplicant]
        else:
            # Matha custom actions ku, default ah Admin mattum
            self.permission_classes = [IsAuthenticated, IsAdminUser]
        return super().get_permissions()

    def perform_create(self, serializer):
        # userID ippo model la default function generate_userID muliyama varum
        serializer.save()
        logger.info(f"Applicant created with userID {serializer.instance.userID} by user {self.request.user.username}.")


    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            # userID ah response la kaatanum
            response_data = serializer.data
            # response_data['userID'] = serializer.instance.userID # Serializer la userID irundha idhu thevai illa
            logger.info(f"Applicant created successfully. UserID: {serializer.instance.userID}, Data: {response_data}")
            return Response({'status': 'success','data': response_data,'message': 'Applicant created successfully.'}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            logger.warning(f"Validation failed during applicant creation by user {request.user.username}: {e.detail}")
            return Response({'status': 'error','errors': e.detail, 'message': 'Validation failed.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected server error during applicant creation by user {request.user.username}: {e}", exc_info=True)
            return Response({'status': 'error','message': 'Unexpected server error.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # perform_update sari thaan
    def perform_update(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object() # Idhu ippo userID vechi object ah edukkum
        
        try:
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            # Update aanadhukku approm fresh data edukkanum
            # instance = self.get_object() # Thevai illa, serializer.instance la updated data irukkum
            # serializer = self.get_serializer(instance) # Ippavum thevai illa, mela use panna serializer eh podhum
            logger.info(f"Applicant userID {instance.userID} updated by user {request.user.username}. Data: {serializer.data}")
            return Response({'status': 'success','data': serializer.data,'message': 'Applicant updated successfully.'}, status=status.HTTP_200_OK)
        except ValidationError as e:
            logger.warning(f"Validation failed during applicant update for userID {instance.userID} by user {request.user.username}: {e.detail}")
            return Response({'status': 'error','errors': e.detail,'message': 'Validation failed.'}, status=status.HTTP_400_BAD_REQUEST)
        except Applicant.DoesNotExist: # Idhu get_object() la irundhu varum, DRF handle pannum
            logger.warning(f"Applicant not found for update with userID {kwargs.get('userID')} by user {request.user.username}") # kwargs['userID']
            return Response({'status': 'error', 'message': 'Applicant not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected server error during applicant update for userID {instance.userID} by user {request.user.username}: {e}", exc_info=True)
            return Response({'status': 'error','message': 'Unexpected server error.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        # get_object() ippo userID vechi object ah edukkum and all_objects la irundhu thedum (get_queryset padi)
        instance = self.get_object() # userID vechi thedum
        
        if instance.is_deleted:
            # Aagave delete aana record ah delete panna try panna, 204 anuppalam
            logger.info(f"Attempt to delete already soft-deleted applicant userID {instance.userID} by user {request.user.username}")
            return Response(status=status.HTTP_204_NO_CONTENT)
        try:
            if hasattr(instance, 'soft_delete'):
                instance.soft_delete()
            else:
                instance.is_deleted = True
                instance.save(update_fields=['is_deleted'])
            logger.info(f"Applicant userID {instance.userID} soft-deleted by user {request.user.username}")
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Error soft-deleting applicant userID {instance.userID} by user {request.user.username}: {e}", exc_info=True)
            return Response({'status': 'error', 'message': 'Error deleting applicant.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], url_path='restore') # detail=True na /applicants/{userID}/restore/
    def restore_applicant(self, request, userID=None): # userID parameter peru URL la irundhu varum (lookup_field)
        instance = self.get_object() # Idhu userID vechi correct ah object ah edukkum (all_objects la irundhu)
        
        if not instance.is_deleted:
            logger.info(f"Attempt to restore an already active applicant userID {instance.userID} by user {request.user.username}")
            return Response({'status': 'info', 'message': 'Applicant is already active.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            if hasattr(instance, 'restore'):
                instance.restore()
            else:
                instance.is_deleted = False
                instance.save(update_fields=['is_deleted'])
            
            serializer = self.get_serializer(instance) # Restored instance oda data
            logger.info(f"Applicant userID {instance.userID} restored by user {request.user.username}")
            return Response({'status': 'success', 'message': 'Applicant restored.', 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error restoring applicant userID {instance.userID} by user {request.user.username}: {e}", exc_info=True)
            return Response({'status': 'error', 'message': 'Error restoring applicant.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# --- user_profile_view function ---
@api_view(['GET'])
@permission_classes([IsAuthenticated]) # User must be logged in
def user_profile_view(request):
    user = request.user
    if not user.is_authenticated: # Should be redundant due to @permission_classes
         return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

    groups = list(user.groups.values_list('name', flat=True))
    role = 'Unknown'
    # Determine role based on groups, respecting hierarchy (Admin > Manager > Staff)
    if 'Admin' in groups or user.is_superuser:
        role = 'Admin'
    elif 'Manager' in groups:
        role = 'Manager'
    elif 'Staff' in groups:
        role = 'Staff'

    data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': role,
        'groups': groups, # Optional: Send all group names
        'is_superuser': user.is_superuser
    }
    logger.info(f"Returning profile for user: {user.username}, Role: {role}")
    return Response(data, status=status.HTTP_200_OK)
# --- End user_profile_view function ---


# --- Start Validation View ---
@api_view(['POST'])
@permission_classes([IsAuthenticated, CanCreateUpdateApplicant]) # Allows Staff, Manager, Admin
def validate_applicant_view(request):
    if not isinstance(request.data, dict):
        logger.warning(f"Invalid request format for applicant validation by user {request.user.username}. Data: {request.data}")
        return Response({
            "valid": False,
            "error": "Invalid request format."
            }, status=status.HTTP_400_BAD_REQUEST)

    first_name = request.data.get('first_name')
    phone = request.data.get('phone')

    if not first_name or not phone:
        logger.warning(f"Missing first_name or phone for applicant validation by user {request.user.username}. Data: {request.data}")
        return Response({
            "valid": False,
            "error": "First name and phone number are required."
            }, status=status.HTTP_400_BAD_REQUEST)

    try:
       
        applicant = Applicant.objects.get(
            first_name__iexact=first_name.strip(),
            phone=phone.strip()
        )
        
        logger.info(f"Applicant {applicant.pk} ({applicant.first_name} {applicant.last_name}) verified by user {request.user.username}.")
        return Response({
            "valid": True,
            "message": f"Applicant {applicant.first_name} {applicant.last_name} verified.",
            "applicant_pk": applicant.pk,
            "applicant_userID": applicant.userID 
            }, status=status.HTTP_200_OK)

    except ObjectDoesNotExist:
        logger.info(f"Validation failed: Active applicant not found for first_name='{first_name}', phone='{phone}' by user {request.user.username}.")
        return Response({
            "valid": False,
            "error": "Active applicant with matching name and phone not found."
            }, status=status.HTTP_404_NOT_FOUND)
    except Applicant.MultipleObjectsReturned:
        logger.warning(f"Data inconsistency: Multiple active applicants found for first_name='{first_name}', phone='{phone}'. Validation attempt by user {request.user.username}.")
        return Response({
            "valid": False,
            "error": "Data inconsistency: Multiple matching active applicants found. Please contact support."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error(f"An unexpected error occurred during applicant validation for first_name='{first_name}', phone='{phone}' by user {request.user.username}: {e}", exc_info=True)
        return Response({
            "valid": False,
            "error": "An error occurred during validation. Please try again."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# --- End Validation View ---