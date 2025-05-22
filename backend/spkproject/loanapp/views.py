# loanapp/views.py
import logging
from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

import json
from django_filters.rest_framework import DjangoFilterBackend
from .models import LoanApplication, Nominee, EMISchedule
from .serializers import LoanApplicationSerializer
from applicants.models import Applicant
from core.permissions import IsManagerUser, IsAdminUser 

logger = logging.getLogger(__name__)

class LoanApplicationViewSet(viewsets.ModelViewSet):
    queryset = LoanApplication.objects.all().order_by('-id')
    serializer_class = LoanApplicationSerializer
    lookup_field = 'pk'#lianID
    

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['phone', 'loanID', 'applicant_record__userID', 'status']

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'list':
           
            self.permission_classes = [IsAuthenticated]
        elif self.action == 'retrieve':
           
            self.permission_classes = [IsAuthenticated] # Add IsApplicantOwner if needed for object-level
        elif self.action == 'create':
            self.permission_classes = [IsAuthenticated] # Any logged-in user can apply
        elif self.action in ['update', 'partial_update']:
          
            self.permission_classes = [IsManagerUser] # Assumes Manager can initiate changes, Admin can too (via IsManagerUser perm)
        elif self.action == 'destroy':
            self.permission_classes = [IsAdminUser] # Only Admins can delete
        elif self.action == 'validate_applicant_action': # For the custom action
            self.permission_classes = [IsAuthenticated] # Or more specific if needed
        else:
            self.permission_classes = [IsAuthenticated] # Default
        
        return [permission() for permission in self.permission_classes]

    def get_queryset(self):
      
        user = self.request.user
        if not user.is_authenticated:
            return LoanApplication.objects.none()

      
        is_admin_user = IsAdminUser().has_permission(self.request, self)
        is_manager_user = IsManagerUser().has_permission(self.request, self)


        if is_admin_user or is_manager_user:
           
            return LoanApplication.objects.all().order_by('-id')
        else:
           
            try:
                
                applicant_profile = Applicant.objects.filter(email=user.email).first() # Example: using email
                if applicant_profile:
                   
                    return LoanApplication.objects.filter(applicant_record=applicant_profile.userID).order_by('-id')
                else:
                    # logger.warning(f"No applicant profile found for user {user.username} (Email: {user.email}). Returning no loans.")
                    return LoanApplication.objects.none()
            except Applicant.DoesNotExist: # Should be caught by .first() returning None
                # logger.warning(f"Applicant.DoesNotExist for user {user.username}. Returning no loans.")
                return LoanApplication.objects.none()
            except Exception as e:
                # logger.error(f"Error fetching applicant profile for {user.username}: {e}", exc_info=True)
                return LoanApplication.objects.none()

    def perform_create(self, serializer):
      
        request = self.request
        print(f"[DEBUG] Request Content-Type: {request.content_type}")
        print(f"[DEBUG] Request data type: {type(request.data)}")
        print(f"[DEBUG] Request.data keys (excluding files): {[key for key in request.data.keys() if key not in request.FILES]}")
        print(f"[DEBUG] Request.FILES keys: {list(request.FILES.keys())}")


        # Print nominees_payload before parsing
        nominees_payload_str_from_data = request.data.get('nominees_payload')
        print(f"[DEBUG] Raw 'nominees_payload' string from request.data: '{nominees_payload_str_from_data}'")

        # Print emi_schedule_payload before parsing
        emi_payload_str_from_data = request.data.get('emi_schedule_payload')
        print(f"[DEBUG] Raw 'emi_schedule_payload' string from request.data: '{emi_payload_str_from_data}'")

        print(f"[DEBUG] Serializer validated_data before save: {serializer.validated_data}")

        applicant_user_id = serializer.validated_data.get('applicant_record') # This is Applicant's userID
        if applicant_user_id:
            existing_pending_apps = LoanApplication.objects.filter(
                applicant_record=applicant_user_id,
                status__in=['PENDING', 'MANAGER_APPROVED'] # Workflow statuses before final decision
            ).exists()
            if existing_pending_apps:
                # logger.warning(f"Applicant {applicant_user_id} already has a pending/manager_approved application. Creation blocked.")
                raise serializers.ValidationError(
                    {"detail": "You already have an application under process. Please wait for it to be resolved."}
                )
        
        loan_instance = serializer.save()
       

        # --- Nominee Data Creation Logic ---
        nominees_payload_str = request.data.get('nominees_payload') # Get it again, just in case
        if nominees_payload_str:
            try:
                nominees_data_list = json.loads(nominees_payload_str)
                
                if isinstance(nominees_data_list, list):
                    for i, nominee_data_dict in enumerate(nominees_data_list):
                        
                        if isinstance(nominee_data_dict, dict):
                            
                            profile_photo_key_actual = f'nominee_{i}_profile_photo'  
                            id_proof_file_key_actual = f'nominee_{i}_id_proof_file' 

                            profile_photo_file = request.FILES.get(profile_photo_key_actual)
                            id_proof_file = request.FILES.get(id_proof_file_key_actual)
                            
                            data_to_create_nominee = {
                                **nominee_data_dict,
                                'loan_application': loan_instance
                            }
                          
                            data_to_create_nominee.pop('profile_photo', None)
                            data_to_create_nominee.pop('id_proof_file', None)


                            if profile_photo_file:
                                data_to_create_nominee['profile_photo'] = profile_photo_file
                                
                            if id_proof_file:
                                data_to_create_nominee['id_proof_file'] = id_proof_file
                                
                            try:
                                created_nominee_instance = Nominee.objects.create(**data_to_create_nominee)
                                print(f"[DEBUG] --- Successfully created Nominee {i} (PK: {created_nominee_instance.pk}) ---")
                                if created_nominee_instance.profile_photo and hasattr(created_nominee_instance.profile_photo, 'name') and created_nominee_instance.profile_photo.name:
                                    print(f"[DEBUG]   Nominee Profile Photo NAME from DB: {created_nominee_instance.profile_photo.name}")
                                    if hasattr(created_nominee_instance.profile_photo, 'url'):
                                        print(f"[DEBUG]   Nominee Profile Photo URL from DB: {created_nominee_instance.profile_photo.url}")
                                else:
                                    print(f"[DEBUG]   Nominee Profile Photo field from DB is EMPTY/None for nominee {created_nominee_instance.pk}.")
                                
                                if created_nominee_instance.id_proof_file and hasattr(created_nominee_instance.id_proof_file, 'name') and created_nominee_instance.id_proof_file.name:
                                    print(f"[DEBUG]   Nominee ID Proof File NAME from DB: {created_nominee_instance.id_proof_file.name}")
                                    if hasattr(created_nominee_instance.id_proof_file, 'url'):
                                        print(f"[DEBUG]   Nominee ID Proof File URL from DB: {created_nominee_instance.id_proof_file.url}")
                                else:
                                    print(f"[DEBUG]   Nominee ID Proof File field from DB is EMPTY/None for nominee {created_nominee_instance.pk}.")
                                print(f"[DEBUG] --- End Nominee Check for {created_nominee_instance.pk} ---")
                                logger.info(f"Created nominee '{nominee_data_dict.get('name')}' for loan PK {loan_instance.pk}")
                            except Exception as nominee_create_exc:
                                print(f"ERROR creating Nominee object for nominee {i}: {nominee_create_exc}")
                                logger.error(f"LoanAppViewSet: Error creating Nominee object for loan {loan_instance.pk}, nominee_data: {nominee_data_dict}, Error: {nominee_create_exc}", exc_info=True)
                        
            except json.JSONDecodeError as e:
               
                logger.error(f"LoanAppViewSet: Failed to parse nominees_payload for loan {loan_instance.pk}: {e}")
            except Exception as e:
               
                logger.error(f"LoanAppViewSet: Error processing nominees for loan {loan_instance.pk}: {e}", exc_info=True)
      
        # --- EMI Schedule Data Creation Logic ---
        emi_payload_str = request.data.get('emi_schedule_payload')
        if emi_payload_str:
            try:
                emi_data_list = json.loads(emi_payload_str)
               
                if isinstance(emi_data_list, list):
                    for emi_data_dict in emi_data_list:
                      
                        if isinstance(emi_data_dict, dict):
                            EMISchedule.objects.create(loan_application=loan_instance, **emi_data_dict)
                            
                            logger.info(f"Created EMI entry for loan PK {loan_instance.pk}, month: {emi_data_dict.get('month')}")
            except json.JSONDecodeError as e:
                print(f"ERROR parsing emi_schedule_payload: {e}")
                logger.error(f"LoanAppViewSet: Failed to parse emi_schedule_payload for loan {loan_instance.pk}: {e}")
            except Exception as e:
                print(f"ERROR creating EMI: {e}")
                logger.error(f"LoanAppViewSet: Error creating EMI for loan {loan_instance.pk}: {e}", exc_info=True)
       
    def create(self, request, *args, **kwargs):
       
        serializer = self.get_serializer(data=request.data)
        try:
            
            serializer.is_valid(raise_exception=True)
           
            self.perform_create(serializer) # This will call the modified perform_create
            
         
            final_loan_instance = LoanApplication.objects.get(pk=serializer.instance.pk)
            response_serializer = self.get_serializer(final_loan_instance) # Use the same serializer class

            headers = self.get_success_headers(response_serializer.data)
            logger.info(f"Loan application PK {final_loan_instance.pk} created by {request.user.username} for applicant {final_loan_instance.applicant_record.userID if final_loan_instance.applicant_record else 'N/A'}")
            return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
           
            logger.warning(f"Loan App Create Validation Error by {request.user.username}: {e.detail}")
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
           
            logger.error(f"Loan App Create Unexpected Error by {request.user.username}: {e}", exc_info=True)
            return Response({"detail": "An unexpected error occurred while creating the loan application."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True) # Default to partial for PATCH
        instance = self.get_object()
        old_status = instance.status
        user = request.user

        # logger.debug(f"Update method for Loan PK {instance.pk} by {user.username}. Current status: {old_status}. Partial: {partial}")
        # logger.debug(f"Request data for update: {request.data}")

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        try:
            serializer.is_valid(raise_exception=True)
            
            new_status = serializer.validated_data.get('status', old_status)
            
            # --- Role-based status transition logic ---
            # Check if _is_in_group is available in this scope
            is_admin_user = IsAdminUser().has_permission(request, self)
            is_manager_user = IsManagerUser().has_permission(request, self) # This might include admin based on your perm def

            if new_status != old_status: # Only apply transition logic if status is actually changing
                if is_admin_user:
                    # Admin can: PENDING -> REJECTED, MANAGER_APPROVED -> APPROVED, MANAGER_APPROVED -> REJECTED
                    allowed_transitions_admin = {
                        'PENDING': ['REJECTED'],
                        'MANAGER_APPROVED': ['APPROVED', 'REJECTED']
                    }
                    if old_status not in allowed_transitions_admin or new_status not in allowed_transitions_admin.get(old_status, []):
                        logger.warning(f"Admin {user.username} attempted invalid status transition for loan {instance.pk}: {old_status} -> {new_status}")
                        return Response({"error": f"Admin cannot transition loan from {old_status} to {new_status}."},
                                        status=status.HTTP_400_BAD_REQUEST)
                elif is_manager_user: # And not admin (if IsManagerUser doesn't inherently include admin)
                                     # If IsManagerUser already checks for admin, this elif might be redundant with the admin block
                    # Manager can: PENDING -> MANAGER_APPROVED, PENDING -> REJECTED
                    allowed_transitions_manager = {
                        'PENDING': ['MANAGER_APPROVED', 'REJECTED']
                    }
                    if old_status not in allowed_transitions_manager or new_status not in allowed_transitions_manager.get(old_status, []):
                        logger.warning(f"Manager {user.username} attempted invalid status transition for loan {instance.pk}: {old_status} -> {new_status}")
                        return Response({"error": f"Manager cannot transition loan from {old_status} to {new_status}."},
                                        status=status.HTTP_400_BAD_REQUEST)
                else: # Applicant or other roles
                    logger.warning(f"User {user.username} (not admin/manager) attempted status change on loan {instance.pk}: {old_status} -> {new_status}")
                    return Response({"error": "You are not authorized to change the loan status."},
                                    status=status.HTTP_403_FORBIDDEN)
            
            # If status is APPROVED, loanID generation is handled by model's save()
            self.perform_update(serializer) # Calls instance.save()

            # --- Nominee and EMI update logic (if payload present) ---
            nominees_payload_str_update = request.data.get('nominees_payload')
            if nominees_payload_str_update:
                try:
                    new_nominees_data_list = json.loads(nominees_payload_str_update)
                    if isinstance(new_nominees_data_list, list):
                        instance.nominees.all().delete() # Simple: delete existing, create new
                        for i, nominee_data_dict in enumerate(new_nominees_data_list):
                            if isinstance(nominee_data_dict, dict):
                                profile_photo_key_actual = f'nominee_{i}_profile_photo'
                                id_proof_file_key_actual = f'nominee_{i}_id_proof_file'
                                profile_photo_file = request.FILES.get(profile_photo_key_actual)
                                id_proof_file = request.FILES.get(id_proof_file_key_actual)

                                data_to_create_nominee = {**nominee_data_dict, 'loan_application': instance}
                                data_to_create_nominee.pop('profile_photo', None)
                                data_to_create_nominee.pop('id_proof_file', None)
                                if profile_photo_file: data_to_create_nominee['profile_photo'] = profile_photo_file
                                if id_proof_file: data_to_create_nominee['id_proof_file'] = id_proof_file
                                
                                Nominee.objects.create(**data_to_create_nominee)
                        # logger.info(f"Nominees updated for loan PK {instance.pk}")
                except json.JSONDecodeError as e:
                    logger.error(f"UPDATE: Failed to parse nominees_payload for loan {instance.pk}: {e}")
                except Exception as e:
                    logger.error(f"UPDATE: Error processing nominees for loan {instance.pk}: {e}", exc_info=True)
            
            emi_data_list_str = request.data.get('emiSchedule_payload') # Note: your frontend uses 'emiSchedule'
            if emi_data_list_str:
                try:
                    emi_data_list = json.loads(emi_data_list_str)
                    if isinstance(emi_data_list, list):
                        # Simple: delete existing, create new. More complex update logic if needed.
                        instance.emiSchedule.all().delete() 
                        for emi_item_data in emi_data_list:
                            if isinstance(emi_item_data, dict):
                                EMISchedule.objects.create(loan_application=instance, **emi_item_data)
                        # logger.info(f"EMI schedule updated for loan PK {instance.pk}")
                except json.JSONDecodeError:
                    logger.error(f"Failed to parse emiSchedule_payload during update for loan {instance.pk}")
                except Exception as e:
                    logger.error(f"Error updating EMI for loan {instance.pk}: {e}", exc_info=True)
            
            # Re-fetch and re-serialize for the response
            final_instance = LoanApplication.objects.get(pk=instance.pk)
            response_serializer = self.get_serializer(final_instance)

            if old_status != final_instance.status:
                log_message = f"Loan application PK {final_instance.pk} status changed from {old_status} to {final_instance.status} by {user.username}."
                if final_instance.status == 'APPROVED' and final_instance.loanID:
                    log_message += f" LoanID {final_instance.loanID} generated."
                # TODO: Trigger notification to applicant
                logger.info(log_message)
            else:
                logger.info(f"Loan application PK {final_instance.pk} updated (fields other than status) by {user.username}.")
            
            return Response(response_serializer.data)
        except serializers.ValidationError as e:
            logger.warning(f"Loan App Update Validation Error for PK {instance.pk} by {user.username}: {e.detail}")
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Loan App Update Unexpected Error for PK {instance.pk} by {user.username}: {e}", exc_info=True)
            return Response({"detail": "An unexpected error occurred during update."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['POST'], url_path='validate-applicant')
    def validate_applicant_action(self, request):
        # This action seems to validate if a LoanApplication already exists for a given name/phone
        # It's not directly part of the approval workflow, but a utility.
        first_name = request.data.get('first_name', '').strip()
        phone = request.data.get('phone', '').strip()
        if not first_name or not phone:
            return Response({"valid": False, "error": "First name and phone number are required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # This assumes first_name and phone are on LoanApplication model directly
            # If they are on Applicant model, the query needs to change
            application = LoanApplication.objects.get(first_name__iexact=first_name, phone=phone)
            serializer = self.get_serializer(application) # Uses LoanApplicationSerializer
            logger.info(f"LoanApplication validation successful for: name='{first_name}', phone='{phone}'. Loan PK: {application.pk}, Loan ID: {application.loanID}")
            return Response({"valid": True, "message": "LoanApplication validation successful.", "application": serializer.data}, status=status.HTTP_200_OK)
        except LoanApplication.DoesNotExist:
            logger.info(f"LoanApplication validation failed (not found) for: name='{first_name}', phone='{phone}'")
            return Response({"valid": False, "error": "No matching loan application found."}, status=status.HTTP_404_NOT_FOUND)
        except LoanApplication.MultipleObjectsReturned:
             logger.error(f"Multiple LoanApplications found for name='{first_name}', phone='{phone}'")
             return Response({"valid": False, "error": "Multiple matching loan applications found. Please contact support."}, status=status.HTTP_409_CONFLICT)
        except Exception as e:
            logger.error(f"Error during LoanApplication validation for name='{first_name}', phone='{phone}': {e}", exc_info=True)
            return Response({"valid": False, "error": "An error occurred during validation."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)