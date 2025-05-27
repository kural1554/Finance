from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User, Group
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.db import IntegrityError, transaction
from django.utils import timezone # For perform_destroy fallback

from .models import EmployeeDetails, EmployeeIDProof # Your EmployeeDetails model
from .serializers import UserEmployeeCreateSerializer, EmployeeDetailsViewSerializer # Your serializers
# --- Import your custom permission classes ---
from core.permissions import (
    IsAdminUser,
    IsManagerUser,
    CanCreateManager,
    CanCreateStaff,
    IsSuperUser,
    _is_in_group
)
from django.db.models import Q 
import logging
logger = logging.getLogger(__name__)


class UserCreationViewSet(viewsets.ViewSet):
   
    permission_classes = [IsAuthenticated] # Base: User must be logged in

    def get_permissions(self):
        """Set permissions based on the action."""
        if self.action == 'create_admin': # <<< NEW ACTION
            self.permission_classes = [IsSuperUser]
        elif self.action == 'create_manager':
            self.permission_classes = [CanCreateManager]
        elif self.action == 'create_staff':
            self.permission_classes = [CanCreateStaff]
        else:
            self.permission_classes = [IsAdminUser] # Default for any other actions
        return super().get_permissions()
    
    def _create_user_with_role(self, request, role_name):
        """
        Helper method to create a user with a specific role and handle associated
        EmployeeDetails profile and EmployeeIDProof documents.
        """
       
        serializer = UserEmployeeCreateSerializer(data=request.data, context={'request': request})
        
        try:
            with transaction.atomic(): # Ensure all operations succeed or fail together
                serializer.is_valid(raise_exception=True)
                user = serializer.save() # Creates User and associated EmployeeDetails

                # --- Process and Save Uploaded ID Proof Documents ---
                if hasattr(user, 'employee_details_profile'):
                    profile_instance = user.employee_details_profile
                    documents_to_create = []
                    index = 0
                    while True:
                        # Construct keys based on frontend FormData naming
                        doc_type_key = f'id_proofs[{index}][type]'
                        doc_id_number_key = f'id_proofs[{index}][idNumber]'
                        doc_file_key = f'id_proofs[{index}][file]'

                        doc_type = request.data.get(doc_type_key)
                        doc_id_number = request.data.get(doc_id_number_key)
                        doc_file = request.FILES.get(doc_file_key) # Files are in request.FILES

                        if doc_type and doc_id_number and doc_file:
                            documents_to_create.append(
                                EmployeeIDProof(
                                    employee_profile=profile_instance,
                                    document_type=doc_type,
                                    document_number=doc_id_number,
                                    document_file=doc_file
                                )
                            )
                            logger.debug(
                                f"Prepared ID proof document for saving: type='{doc_type}', "
                                f"number='{doc_id_number}', file='{doc_file.name}'"
                            )
                            index += 1
                        else:
                            if index == 0:
                                logger.info(f"No ID proof documents found in the request for user {user.username}.")
                            else:
                                logger.debug(f"Finished processing ID proof documents at index {index-1} for user {user.username}.")
                            break # No more document data found for this index or subsequent ones
                    
                    if documents_to_create:
                        EmployeeIDProof.objects.bulk_create(documents_to_create)
                        logger.info(
                            f"Successfully batch-saved {len(documents_to_create)} ID proof "
                            f"documents for {user.username}."
                        )
                else:
                    logger.error(
                        f"Critical: Could not find 'employee_details_profile' for user {user.username} "
                        "after creation. Documents cannot be attached."
                    )
        
            employee_id_display = getattr(user, 'employee_details_profile', None) and \
                                  user.employee_details_profile.employee_id
            logger.info(
                f"{role_name} user '{user.username}' (Employee ID: {employee_id_display}) "
                f"created successfully by '{request.user.username}'."
            )
            return Response({
                "message": f"{role_name} user created successfully. Profile and documents (if any) processed.",
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
                "employee_id": employee_id_display
            }, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            logger.warning(
                f"Validation error creating {role_name} user by {request.user.username}: {e.detail}"
            )
            return Response({"errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError as e:
            logger.error(
                f"IntegrityError creating {role_name} user by {request.user.username}: {e}", exc_info=True
            )
            error_detail = {"detail": f"Failed to create {role_name} user due to a database conflict."}
            if 'username' in str(e).lower():
                error_detail = {'errors': {'username': ['This username is already taken.']}}
            elif 'email' in str(e).lower():
                error_detail = {'errors': {'email': ['This email address is already in use.']}}
            return Response(error_detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(
                f"Unexpected error creating {role_name} user by {request.user.username}: {e}", exc_info=True
            )
            return Response(
                {"error": f"Failed to create {role_name} user due to an unexpected server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'], url_path='create-admin')
    def create_admin(self, request):
        # Only superusers can reach here due to get_permissions
        data = request.data.copy()
        data['role_group_name'] = 'Admin' # Enforce this role
        serializer = UserEmployeeCreateSerializer(data=data, context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            logger.info(f"ADMIN User '{user.username}' created successfully by SUPERUSER '{request.user.username}'.")
            return Response({
                "message": "Admin user created successfully. Profile auto-generated.",
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
                "employee_id": getattr(user, 'employee_details_profile', None) and user.employee_details_profile.employee_id
            }, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            logger.warning(f"Validation error creating admin by {request.user.username}: {e.detail}")
            return Response({"errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        # ... (keep existing IntegrityError and general Exception handling) ...
        except Exception as e:
            logger.error(f"Unexpected error creating admin by {request.user.username}: {e}", exc_info=True)
            return Response({"error": "Failed to create admin user due to an unexpected server error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
    @action(detail=False, methods=['post'], url_path='create-manager')
    def create_manager(self, request):
        data = request.data.copy()
        data['role_group_name'] = 'Manager' # Enforce this role
        serializer = UserEmployeeCreateSerializer(data=data, context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save() # Serializer handles User and EmployeeDetails creation/update
            logger.info(f"Manager '{user.username}' created successfully by '{request.user.username}'. Associated profile employee_id: {getattr(user, 'employee_details_profile', None) and user.employee_details_profile.employee_id}.")
            return Response({
                "message": "Manager user created successfully. Profile auto-generated.",
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
                "employee_id": getattr(user, 'employee_details_profile', None) and user.employee_details_profile.employee_id
            }, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            logger.warning(f"Validation error creating manager by {request.user.username}: {e.detail}")
            return Response({"errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError as e: # Catch IntegrityError specifically from serializer if it bubbles up
            logger.error(f"IntegrityError creating manager by {request.user.username}: {e}", exc_info=True)
            # Check common IntegrityError scenarios
            if 'username' in str(e).lower():
                return Response({'errors': {'username': ['This username is already taken.']}}, status=status.HTTP_400_BAD_REQUEST)
            if 'email' in str(e).lower():
                return Response({'errors': {'email': ['This email address is already in use.']}}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": "Failed to create manager due to a database conflict. Please check unique fields like username or email."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error creating manager by {request.user.username}: {e}", exc_info=True)
            return Response({"error": "Failed to create manager due to an unexpected server error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='create-staff')
    def create_staff(self, request):
        data = request.data.copy()
        data['role_group_name'] = 'Staff' # Enforce this role
        serializer = UserEmployeeCreateSerializer(data=data, context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save() # Serializer handles User and EmployeeDetails creation/update
            logger.info(f"Staff '{user.username}' created successfully by '{request.user.username}'. Associated profile employee_id: {getattr(user, 'employee_details_profile', None) and user.employee_details_profile.employee_id}.")
            return Response({
                "message": "Staff user created successfully. Profile auto-generated.",
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
                "employee_id": getattr(user, 'employee_details_profile', None) and user.employee_details_profile.employee_id
            }, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            logger.warning(f"Validation error creating staff by {request.user.username}: {e.detail}")
            return Response({"errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError as e: # Catch IntegrityError specifically
            logger.error(f"IntegrityError creating staff by {request.user.username}: {e}", exc_info=True)
            if 'username' in str(e).lower():
                return Response({'errors': {'username': ['This username is already taken.']}}, status=status.HTTP_400_BAD_REQUEST)
            if 'email' in str(e).lower():
                return Response({'errors': {'email': ['This email address is already in use.']}}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": "Failed to create staff due to a database conflict. Please check unique fields."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error creating staff by {request.user.username}: {e}", exc_info=True)
            return Response({"error": "Failed to create staff due to an unexpected error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MyEmployeeProfileViewSet(viewsets.ViewSet):
    
    permission_classes = [IsAuthenticated]

    def _get_profile_for_user(self, user):
        """Helper to retrieve the EmployeeDetails instance for the given user."""
        try:
            # 'employee_details_profile' is the related_name from User to EmployeeDetails
            return user.employee_details_profile
        except EmployeeDetails.DoesNotExist:
            logger.error(f"EmployeeDetails profile missing for user {user.username} (ID: {user.id}). This should ideally not happen if signals are working.")
           
            
            raise Http404("Employee profile not found for this user. Please contact support.")
        except AttributeError: # Should not happen if related_name is correct
            logger.error(f"AttributeError accessing employee_details_profile for user {user.username}. Check related_name in EmployeeDetails.user field.")
            raise Http404("Internal configuration error accessing employee profile.")

    @action(detail=False, methods=['get'], url_path='me')
    def retrieve_my_profile(self, request):
        profile = self._get_profile_for_user(request.user)
        serializer = EmployeeDetailsViewSerializer(profile, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['put', 'patch'], url_path='me/update')
    def update_my_profile(self, request):
        profile = self._get_profile_for_user(request.user)
        is_partial = request.method == 'PATCH'
       
        serializer = EmployeeDetailsViewSerializer(profile, data=request.data, partial=is_partial, context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            logger.info(f"EmployeeProfile for user '{request.user.username}' updated successfully.")
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            logger.warning(f"Validation error updating profile for {request.user.username}: {e.detail}")
            return Response({"errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError as e: # Catches IntegrityErrors e.g. if email becomes non-unique
            logger.error(f"IntegrityError updating profile for {request.user.username}: {e}", exc_info=True)
            error_detail = {}
            if 'email' in str(e).lower() and ('auth_user_email_key' in str(e).lower() or 'UNIQUE constraint failed: auth_user.email' in str(e).lower()):
                error_detail['email'] = 'This email address is already in use by another user.'
            else: # General integrity error
                error_detail['non_field_errors'] = ['Update failed due to a data conflict.']
            return Response({"errors": error_detail or {"detail": str(e)}}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error updating profile for {request.user.username}: {e}", exc_info=True)
            return Response({"error": "Failed to update profile due to an unexpected server error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    user = request.user
    role = 'Unknown'
    employee_id_val = None
    phone_number_val = None
    groups = list(user.groups.values_list('name', flat=True)) # Get groups early

    # Try to get profile and its details
    profile_instance = None
    if hasattr(user, 'employee_details_profile'): # Check if the related manager exists
        try:
            profile_instance = user.employee_details_profile # Access the related object
        except EmployeeDetails.DoesNotExist:
            logger.warning(f"User {user.username} does not have an EmployeeDetails profile. Signal might have failed or user type doesn't require one (e.g. superuser created before signal).")
            profile_instance = None # Explicitly set to None

    if profile_instance:
        employee_id_val = profile_instance.employee_id
        phone_number_val = profile_instance.phone_number
        role = profile_instance.role # Use role from EmployeeDetails model property
    elif user.is_superuser:
        role = 'Admin' # Superuser is always Admin
    else: # Fallback if no profile, determine role from groups (though profile.role should handle this)
        if 'Admin' in groups: role = 'Admin'
        elif 'Manager' in groups: role = 'Manager'
        elif 'Staff' in groups: role = 'Staff'
      

    profile_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': role,
        'groups': groups,
        'is_superuser': user.is_superuser,
        'employee_id': employee_id_val, # This comes from EmployeeDetails.employee_id
        'phone_number': phone_number_val  # This comes from EmployeeDetails.phone_number
    }
    return Response(profile_data, status=status.HTTP_200_OK)

class EmployeeDetailsViewSet(viewsets.ModelViewSet):
    serializer_class = EmployeeDetailsViewSerializer
    # Base permission: User must be authenticated. Specific actions have more granular permissions.
    # permission_classes = [permissions.IsAuthenticated] # Using get_permissions for action-specific

    # queryset attribute is used by DRF for some default operations,
    # but get_queryset is the primary source for list/retrieve.
    # Initialize it to something sensible.
    queryset = EmployeeDetails.objects.all().select_related('user').order_by('-created_at')

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires,
        based on the action.
        """
        if self.action in ['list', 'retrieve']:
            # Managers and Admins can list and retrieve employee details.
            return [IsAuthenticated(), IsManagerUser()]
        elif self.action in ['update', 'partial_update']:
            # Managers and Admins can update. Specific checks in perform_update.
            return [IsAuthenticated(), IsManagerUser()]
        elif self.action == 'destroy': # This is our soft delete
            return [IsAuthenticated(), IsAdminUser()]
        elif self.action == 'restore_employee_profile':
            return [IsAuthenticated(), IsAdminUser()]
        # Default permissions for other actions if any (e.g., custom actions)
        return [IsAuthenticated()] # Or a more restrictive default

    def get_queryset(self):
        user = self.request.user
        
        # Determine the base queryset: all profiles or only active ones
        include_deleted_param = self.request.query_params.get('include_deleted', 'false').lower()
        
        if include_deleted_param == 'true':
            # Only Admins/Superusers should typically see all (including deleted) profiles
            if not (user.is_superuser or _is_in_group(user, 'Admin')):
                logger.warning(
                    f"User {user.username} (not Admin/Superuser) attempted to list with include_deleted=true. "
                    "Restricting queryset to only their own active profile or none."
                )
                # Fallback to a very restricted queryset for non-admins asking for deleted items
                # Or raise PermissionDenied("You are not authorized to view deleted profiles.")
                return EmployeeDetails.active_objects.filter(user=user).select_related('user').order_by('-created_at')
            
            # Authorized user (Admin/Superuser) requests all profiles
            base_queryset = EmployeeDetails.objects.all().select_related('user')
        else:
            # Default: show only active profiles
            base_queryset = EmployeeDetails.active_objects.all().select_related('user')

        # Apply role-based filtering
        if user.is_superuser:
            # If the superuser is also explicitly in the 'Admin' group, they are treated like a regular Admin for listing.
            # Otherwise, a "pure" superuser sees Admins, Managers, Staff, but not other "pure" superusers.
            if not _is_in_group(user, 'Admin'):
                 # Show Admins, Managers, Staff. Exclude other pure superusers.
                return base_queryset.exclude(
                    Q(user__is_superuser=True) & ~Q(user__groups__name='Admin') & ~Q(user=user)
                ).distinct().order_by('-user__date_joined', '-created_at')
            # If superuser is also in Admin group, they fall into the Admin logic below.

        if _is_in_group(user, 'Admin'):
            # Admin sees other Admins (non-superusers or themselves if they are a superuser-admin),
            # Managers, and Staff.
            return base_queryset.filter(
                Q(user__groups__name='Admin') | 
                Q(user__groups__name='Manager') | 
                Q(user__groups__name='Staff')
            ).exclude( # Exclude superusers who are NOT also in the Admin group, unless it's the requesting admin themselves
                Q(user__is_superuser=True) & ~Q(user__groups__name='Admin') & ~Q(user=user)
            ).distinct().order_by('-user__date_joined', '-created_at')

        elif _is_in_group(user, 'Manager'):
            # Manager sees Staff.
            # Optionally, Managers can see other Managers (currently configured not to).
            return base_queryset.filter(
                Q(user__groups__name='Staff')
                # | Q(user__groups__name='Manager') # Uncomment if Managers should see other Managers
            ).exclude( # Ensure managers cannot see Admins or Superusers
                Q(user__groups__name='Admin') | Q(user__is_superuser=True)
            ).distinct().order_by('-user__date_joined', '-created_at')

        # Staff users are blocked by get_permissions for 'list' action (IsManagerUser).
        # If permissions were IsStaffUser, this would be the logic:
        # elif _is_in_group(user, 'Staff'):
        #     return base_queryset.filter(user=user).order_by('-user__date_joined', '-created_at')

        logger.warning(
            f"User {user.username} (role not explicitly handled or insufficient permissions for list view) "
            "attempted to list employees. Returning empty queryset."
        )
        return base_queryset.none() # Fallback for unhandled roles or if permissions fail unexpectedly


    def perform_update(self, serializer):
        requesting_user = self.request.user
        # The instance being updated is serializer.instance (EmployeeDetails object)
        # The user associated with that profile is serializer.instance.user
        profile_being_updated = serializer.instance
        user_account_being_updated = profile_being_updated.user

        # --- Permission checks before saving ---
        # 1. Superusers can update anyone (except maybe other superusers if stricter rules apply)
        if requesting_user.is_superuser:
            # A superuser might not be allowed to easily demote/deactivate another superuser
            if user_account_being_updated.is_superuser and user_account_being_updated != requesting_user:
                 logger.warning(f"Superuser {requesting_user.username} attempting to modify another superuser {user_account_being_updated.username}.")
                 # Decide on policy: allow, or raise PermissionDenied. For now, allow with logging.

            instance = serializer.save()
            logger.info(f"EmployeeDetails for '{instance.user.username}' (ID: {instance.employee_id}) updated by SUPERUSER '{requesting_user.username}'.")
            return

        # 2. Admins can update other Admins, Managers, Staff. Cannot update Superusers.
        if _is_in_group(requesting_user, 'Admin'):
            if user_account_being_updated.is_superuser:
                raise PermissionDenied("Admins cannot modify Superuser accounts.")
            # Admins can modify other Admins, Managers, Staff
            instance = serializer.save()
            logger.info(f"EmployeeDetails for '{instance.user.username}' (ID: {instance.employee_id}) updated by ADMIN '{requesting_user.username}'.")
            return

        # 3. Managers can update Staff and potentially other Managers (depending on config). Cannot update Admins/Superusers.
        if _is_in_group(requesting_user, 'Manager'):
            if user_account_being_updated.is_superuser or _is_in_group(user_account_being_updated, 'Admin'):
                raise PermissionDenied("Managers cannot modify Admin or Superuser accounts.")
            
            # If managers can only update staff:
            if not _is_in_group(user_account_being_updated, 'Staff'):
                 # And if they are trying to update another manager (and this is not allowed)
                if _is_in_group(user_account_being_updated, 'Manager') and user_account_being_updated != requesting_user: # Or a more general check
                     # raise PermissionDenied("Managers can only update Staff profiles or their own.") # Be more specific based on policy
                     pass # Assuming for now a manager can update another manager. Refine if needed.


            # Prevent Manager from setting a leaving_date for an Admin (already covered by group check, but good explicit check)
            if 'leaving_date' in serializer.validated_data and serializer.validated_data['leaving_date'] is not None:
                if _is_in_group(user_account_being_updated, 'Admin') or user_account_being_updated.is_superuser:
                    raise PermissionDenied("Managers cannot set a leaving date for Admins or Superusers.")

            instance = serializer.save()
            logger.info(f"EmployeeDetails for '{instance.user.username}' (ID: {instance.employee_id}) updated by MANAGER '{requesting_user.username}'.")
            return
        
        # If none of the above, permission should have been caught by get_permissions
        raise PermissionDenied("You do not have permission to perform this update.")


    def perform_destroy(self, instance): # Soft delete
        requesting_user = self.request.user
        profile_being_deleted = instance
        user_account_being_deleted = profile_being_deleted.user

        # Permissions for destroy are IsAdminUser (checked by get_permissions)
        # Additional sanity checks:
        if user_account_being_deleted == requesting_user:
            raise PermissionDenied("You cannot deactivate your own account using this administrative endpoint.")

        if user_account_being_deleted.is_superuser and not requesting_user.is_superuser:
            raise PermissionDenied("Only a Superuser can deactivate another Superuser's account.")
        
        # An Admin should not be able to deactivate a Superuser (even if superuser is in Admin group)
        if _is_in_group(requesting_user, 'Admin') and not requesting_user.is_superuser:
            if user_account_being_deleted.is_superuser:
                raise PermissionDenied("Admins cannot deactivate Superuser accounts.")
        
        if hasattr(instance, 'soft_delete_profile'):
            instance.soft_delete_profile()
            logger.info(f"EmployeeProfile for user '{user_account_being_deleted.username}' (ID: {instance.employee_id}) soft-deleted by '{requesting_user.username}'.")
        else:
            # Fallback logic
            instance.is_deleted = True
            instance.deleted_at = timezone.now()
            if not instance.leaving_date:
                instance.leaving_date = timezone.now().date()
            if instance.user: # Should always be true for an EmployeeDetails instance
                instance.user.is_active = False
                instance.user.save(update_fields=['is_active'])
            instance.save(update_fields=['is_deleted', 'deleted_at', 'leaving_date']) # Be specific
            logger.warning(f"EmployeeProfile for user '{user_account_being_deleted.username}' (ID: {instance.employee_id}) soft-deleted (FALLBACK) by '{requesting_user.username}'.")


    @action(detail=True, methods=['post'], url_path='restore-profile', permission_classes=[IsAdminUser])
    def restore_employee_profile(self, request, pk=None):
        # permission_classes=[IsAdminUser] ensures only Admin/Superuser can call this
        profile = get_object_or_404(EmployeeDetails.objects.all(), pk=pk) # Get any profile status

        # Additional check: A regular Admin should not be able to restore a Superuser profile
        # if profile.user.is_superuser and not request.user.is_superuser:
        #     raise PermissionDenied("Only a Superuser can restore another Superuser's profile.")
        # This logic might be too strict if a superuser was accidentally deactivated by another superuser
        # and an Admin needs to fix it. For now, IsAdminUser permission is the main gate.

        if not profile.is_deleted and profile.leaving_date is None:
            return Response(
                {'status': 'info', 'message': 'Employee profile is already active and not marked for leaving.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            if hasattr(profile, 'restore_profile'):
                profile.restore_profile()
                logger.info(f"EmployeeProfile for user '{profile.user.username}' (ID: {profile.employee_id}) restored by '{request.user.username}'.")
                serializer = self.get_serializer(profile) # Use self.get_serializer for context
                return Response({'status': 'success', 'message': 'Employee profile restored.', 'data': serializer.data})
            else:
                # Fallback logic
                profile.is_deleted = False
                profile.deleted_at = None
                profile.leaving_date = None # Explicitly clear leaving_date
                if profile.user:
                    profile.user.is_active = True
                    profile.user.save(update_fields=['is_active'])
                profile.save(update_fields=['is_deleted', 'deleted_at', 'leaving_date']) # Be specific
                logger.warning(f"EmployeeProfile for user '{profile.user.username}' (ID: {profile.employee_id}) restored (FALLBACK) by '{request.user.username}'.")
                serializer = self.get_serializer(profile)
                return Response({'status': 'success', 'message': 'Employee profile restored (fallback).', 'data': serializer.data})

        except Exception as e:
            logger.error(f"Error restoring profile for user {profile.user.username} (ID: {profile.employee_id}) by '{request.user.username}': {e}", exc_info=True)
            return Response(
                {'status': 'error', 'message': 'An unexpected error occurred while restoring the employee profile.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
