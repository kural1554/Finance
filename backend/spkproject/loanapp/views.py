# loanapp/views.py
import logging
from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from decimal import Decimal, InvalidOperation
import json
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone # Added timezone import

from .models import LoanApplication, Nominee, EMISchedule
from .serializers import LoanApplicationSerializer, EMIScheduleSerializer, NomineeSerializer
from applicants.models import Applicant # Ensure this path is correct
from core.permissions import IsManagerUser, IsAdminUser # Ensure this path is correct

logger = logging.getLogger(__name__)

class LoanApplicationViewSet(viewsets.ModelViewSet):
    queryset = LoanApplication.objects.all().order_by('-LoanRegDate', '-id') # Ordered by date then ID
    serializer_class = LoanApplicationSerializer
    lookup_field = 'pk'
    
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
            self.permission_classes = [IsAuthenticated]
        elif self.action == 'create':
            self.permission_classes = [IsAuthenticated]
        elif self.action in ['update', 'partial_update']:
            self.permission_classes = [IsManagerUser] # Staff updating payments
        elif self.action == 'destroy':
            self.permission_classes = [IsAdminUser]
        elif self.action == 'validate_applicant_action':
            self.permission_classes = [IsAuthenticated] # Staff using the portal
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
            return LoanApplication.objects.all().order_by('-LoanRegDate', '-id')
        else:
            # For regular users, show their own applications (if applicable)
            try:
                applicant_profile = Applicant.objects.filter(email=user.email).first()
                if applicant_profile:
                    return LoanApplication.objects.filter(applicant_record=applicant_profile).order_by('-LoanRegDate', '-id')
                else:
                    return LoanApplication.objects.none()
            except Applicant.DoesNotExist:
                return LoanApplication.objects.none()
            except Exception as e:
                logger.error(f"Error fetching applicant profile for {user.username}: {e}", exc_info=True)
                return LoanApplication.objects.none()

    def perform_create(self, serializer):
        request = self.request
        applicant_user_id_obj = serializer.validated_data.get('applicant_record')

        if applicant_user_id_obj:
            if LoanApplication.objects.filter(
                applicant_record=applicant_user_id_obj
            ).exclude(
                status__in=['PAID', 'REJECTED', 'CANCELLED']
            ).exists():
                raise serializers.ValidationError({
                    "detail": "You already have an unresolved loan application. "
                              "It must be fully paid or resolved before applying for a new one."
                })
        
        loan_instance = serializer.save()

        nominees_payload_str = request.data.get('nominees_payload')
        if nominees_payload_str:
            try:
                nominees_data_list = json.loads(nominees_payload_str)
                if isinstance(nominees_data_list, list):
                    for i, nominee_data_dict in enumerate(nominees_data_list):
                        if isinstance(nominee_data_dict, dict):
                            profile_photo_key = f'nominee_{i}_profile_photo'
                            id_proof_key = f'nominee_{i}_id_proof_file'
                            
                            files_for_nominee = {}
                            if request.FILES.get(profile_photo_key):
                                files_for_nominee['profile_photo'] = request.FILES.get(profile_photo_key)
                            if request.FILES.get(id_proof_key):
                                files_for_nominee['id_proof_file'] = request.FILES.get(id_proof_key)
                            
                            nominee_data_for_serializer = {k:v for k,v in nominee_data_dict.items() if k not in ['profile_photo', 'id_proof_file']}
                            nominee_data_for_serializer.update(files_for_nominee)

                            nom_serializer = NomineeSerializer(data=nominee_data_for_serializer)
                            if nom_serializer.is_valid():
                                Nominee.objects.create(loan_application=loan_instance, **nom_serializer.validated_data)
                            else:
                                logger.warning(f"Nominee creation validation error for loan {loan_instance.pk}, item {i}: {nom_serializer.errors}")
                                # Consider raising an error to stop the whole process if a nominee is invalid
                                # raise serializers.ValidationError({"nominees": f"Invalid data for nominee {i+1}: {nom_serializer.errors}"})
            except json.JSONDecodeError:
                 logger.error(f"CREATE: Invalid JSON for nominees_payload for loan {loan_instance.pk if loan_instance else 'new'}", exc_info=True)
                 # Decide if this should fail the entire creation
            except Exception as e:
                logger.error(f"CREATE: Error processing nominees for loan {loan_instance.pk if loan_instance else 'new'}: {e}", exc_info=True)
      
        emi_payload_str = request.data.get('emi_schedule_payload')
        if emi_payload_str:
            try:
                emi_data_list = json.loads(emi_payload_str)
                if isinstance(emi_data_list, list):
                    for emi_data_dict in emi_data_list:
                        if isinstance(emi_data_dict, dict):
                            # Exclude processor fields for initial creation
                            data_for_emi_creation = {k:v for k,v in emi_data_dict.items() if k not in ['payment_processed_by', 'payment_processed_by_username', 'payment_processed_at']}
                            emi_creation_serializer = EMIScheduleSerializer(data=data_for_emi_creation)
                            if emi_creation_serializer.is_valid():
                                EMISchedule.objects.create(loan_application=loan_instance, **emi_creation_serializer.validated_data)
                            else:
                                logger.error(f"EMI data validation error (Create) for loan {loan_instance.pk}: {emi_creation_serializer.errors}")
                                # Consider raising an error
            except json.JSONDecodeError:
                logger.error(f"CREATE: Invalid JSON for emi_schedule_payload for loan {loan_instance.pk if loan_instance else 'new'}", exc_info=True)
            except Exception as e:
                logger.error(f"CREATE: Error creating EMI for loan {loan_instance.pk if loan_instance else 'new'}: {e}", exc_info=True)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            final_loan_instance = LoanApplication.objects.get(pk=serializer.instance.pk)
            response_serializer = self.get_serializer(final_loan_instance)
            headers = self.get_success_headers(response_serializer.data)
            logger.info(f"Loan application PK {final_loan_instance.pk} (ID: {final_loan_instance.loanID}) created by {request.user.username}")
            return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            logger.warning(f"Loan App Create Validation Error by {request.user.username}: {e.detail}")
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Loan App Create Unexpected Error by {request.user.username}: {e}", exc_info=True)
            return Response({"detail": "An unexpected error occurred while creating the loan application."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object() # LoanApplication instance
        original_status = instance.status
        user_making_update = request.user # Staff member

        # Handle main LoanApplication fields update
        loan_app_serializer = self.get_serializer(instance, data=request.data, partial=partial)
        try:
            loan_app_serializer.is_valid(raise_exception=True)
            
            status_from_payload = loan_app_serializer.validated_data.get('status')

            if status_from_payload and status_from_payload != original_status:
                # Apply status transition rules only if status is explicitly in payload
                is_admin = IsAdminUser().has_permission(request, self)
                is_manager = IsManagerUser().has_permission(request, self)
                if not (is_admin or is_manager):
                    return Response({"error": "You are not authorized to directly change the loan status."}, status=status.HTTP_403_FORBIDDEN)
                
                # Example: Re-integrate your detailed transition logic if needed
                # allowed_transitions = {'PENDING': ['MANAGER_APPROVED', 'REJECTED'], ...}
                # if original_status not in allowed_transitions or status_from_payload not in allowed_transitions[original_status]:
                #     return Response({"error": f"Cannot transition from {original_status} to {status_from_payload}."}, status.HTTP_400_BAD_REQUEST)
            
            self.perform_update(loan_app_serializer) # Saves LoanApplication instance
            instance.refresh_from_db() # Get the latest, including any status changes from perform_update

        except serializers.ValidationError as e:
            logger.warning(f"Loan App Main Update Validation Error for PK {instance.pk} by {user_making_update.username}: {e.detail}")
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e: # Catch other errors during main loan app update
            logger.error(f"Loan App Main Update Unexpected Error for PK {instance.pk} by {user_making_update.username}: {e}", exc_info=True)
            return Response({"detail": "An unexpected error occurred during loan application update."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # --- Nominee update logic (if payload present) ---
        nominees_payload_str_update = request.data.get('nominees_payload')
        if nominees_payload_str_update is not None: # Allows empty string/list to clear nominees
            try:
                new_nominees_data_list = json.loads(nominees_payload_str_update) if nominees_payload_str_update else []
                if isinstance(new_nominees_data_list, list):
                    with transaction.atomic():
                        instance.nominees.all().delete() 
                        for i, nominee_data_dict in enumerate(new_nominees_data_list):
                            if isinstance(nominee_data_dict, dict):
                                # (Simplified - use NomineeSerializer for validation as in perform_create)
                                profile_photo_key = f'nominee_{i}_profile_photo' # Adjust key based on frontend
                                id_proof_key = f'nominee_{i}_id_proof_file' # Adjust key
                                nominee_data_dict['profile_photo'] = request.FILES.get(profile_photo_key)
                                nominee_data_dict['id_proof_file'] = request.FILES.get(id_proof_key)
                                # ... (handle files and use NomineeSerializer)
                                Nominee.objects.create(loan_application=instance, **nominee_data_dict)
            except Exception as e:
                logger.error(f"UPDATE: Error processing nominees for loan {instance.pk}: {e}", exc_info=True)
                # Decide if this should cause the update to fail
                # return Response({"detail": "Error processing nominee data."}, status=status.HTTP_400_BAD_REQUEST)


        # --- EMI Schedule Update Logic ---
        loan_status_was_updated_to_paid_this_request = False
        updated_emi_schedule_data_payload = request.data.get('emiSchedule')

        if updated_emi_schedule_data_payload is not None: # Allows empty list to clear EMIs
            if not isinstance(updated_emi_schedule_data_payload, list):
                return Response({"detail": "emiSchedule must be a list of objects."}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                with transaction.atomic():
                    instance.emiSchedule.all().delete() # Simple approach: delete all and recreate

                    for idx, emi_item_data_from_payload in enumerate(updated_emi_schedule_data_payload):
                        if not isinstance(emi_item_data_from_payload, dict):
                            # This case should ideally be caught by frontend or a more robust outer validation
                            logger.warning(f"EMI item at index {idx} is not a dict. Skipping.")
                            continue 

                        # Exclude fields that backend should control during payment processing
                        data_for_emi_serializer = {k:v for k,v in emi_item_data_from_payload.items() 
                                                   if k not in ['id', 'payment_processed_by', 'payment_processed_by_username', 'payment_processed_at']}
                        
                        emi_creation_serializer = EMIScheduleSerializer(data=data_for_emi_serializer)
                        if emi_creation_serializer.is_valid():
                            validated_data_for_save = emi_creation_serializer.validated_data
                            
                            # Check paymentAmount from the original payload item to decide on processor
                            payment_amount_decimal = Decimal(str(emi_item_data_from_payload.get('paymentAmount', '0.00'))) # Ensure string conversion for Decimal

                            if payment_amount_decimal > Decimal('0.00'):
                                validated_data_for_save['payment_processed_by'] = user_making_update
                                validated_data_for_save['payment_processed_at'] = timezone.now()
                            else:
                                validated_data_for_save['payment_processed_by'] = None
                                validated_data_for_save['payment_processed_at'] = None
                            
                            EMISchedule.objects.create(
                                loan_application=instance,
                                **validated_data_for_save
                            )
                        else:
                            logger.error(f"EMI data validation error (Update) for loan {instance.pk}, item {idx}: {emi_creation_serializer.errors}")
                            return Response({"detail": f"Invalid EMI data at index {idx}: {emi_creation_serializer.errors}"}, status=status.HTTP_400_BAD_REQUEST)
                    
                    logger.info(f"EMI schedule processed for loan PK {instance.pk} with {len(updated_emi_schedule_data_payload)} items.")

                    # Auto-set to PAID if applicable, only if not already in a terminal state
                    if instance.status not in ['PAID', 'REJECTED', 'CANCELLED']:
                        all_emis_for_loan = instance.emiSchedule.all() # Re-fetch after creation
                        total_emi_amount_due = sum(e.emiTotalMonth for e in all_emis_for_loan if e.emiTotalMonth is not None)
                        total_amount_paid_by_user = sum(e.paymentAmount for e in all_emis_for_loan if e.paymentAmount is not None)

                        # Using a small tolerance for floating point comparisons might be safer if emiTotalMonth can have many decimal places
                        if total_emi_amount_due > Decimal('0.00') and (total_amount_paid_by_user >= (total_emi_amount_due - Decimal('0.005'))):
                            instance.status = 'PAID'
                            instance.admin_remarks = f"{instance.admin_remarks or ''}\nAutomatically marked as PAID due to full repayment.".strip()
                            instance.save(update_fields=['status', 'admin_remarks']) # Save only these changed fields
                            loan_status_was_updated_to_paid_this_request = True
                            logger.info(f"Loan PK {instance.pk} (ID: {instance.loanID}) automatically marked as PAID.")
            except Exception as e: # Catch errors during EMI processing
                logger.error(f"Error processing/updating EMI schedule for loan {instance.pk}: {e}", exc_info=True)
                return Response({"detail": "An error occurred while processing the EMI schedule."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        if loan_status_was_updated_to_paid_this_request:
            instance.refresh_from_db() # Ensure the instance for response has the 'PAID' status

        final_loan_application_instance = LoanApplication.objects.get(pk=instance.pk) # Fetch latest for response
        response_serializer = self.get_serializer(final_loan_application_instance) # Use the viewset's serializer
        logger.info(f"Loan application PK {instance.pk} (ID: {instance.loanID}) updated by {user_making_update.username}. Final status for response: {final_loan_application_instance.status}")
        return Response(response_serializer.data)


    @action(detail=False, methods=['POST'], url_path='validate-applicant')
    def validate_applicant_action(self, request):
        first_name = request.data.get('first_name', '').strip()
        phone = request.data.get('phone', '').strip()
        
        if not first_name or not phone:
            return Response({
                "valid": False, "message": "First name and phone number are required.",
                "application": None, "actionable_payment": False
            }, status=status.HTTP_400_BAD_REQUEST)
        try:
            application = LoanApplication.objects.filter(
                first_name__iexact=first_name, 
                phone=phone,
            ).order_by('-LoanRegDate', '-id').first()

            if not application:
                 logger.info(f"Validation: No application found for name='{first_name}', phone='{phone}'")
                 return Response({
                     "valid": False, "message": "No loan application found for the provided details.",
                     "application": None, "actionable_payment": False
                 }, status=status.HTTP_404_NOT_FOUND)

            serializer = self.get_serializer(application) # Serializer now includes status_display and processed_by in EMIs
            response_data = {
                "valid": True, 
                "application": serializer.data,
                "actionable_payment": False, # Default
                "message": ""
            }

            app_status = application.status
            status_display_from_app = application.get_status_display()

            if app_status in ['ACTIVE', 'OVERDUE'] or (app_status == 'APPROVED' and application.loanID):
                response_data["actionable_payment"] = True
                response_data["message"] = f"Loan details fetched (Status: {status_display_from_app}). Ready for payment."
            elif app_status == 'PAID':
                response_data["message"] = f"This loan (Status: {status_display_from_app}) has been fully paid."
            elif app_status in ['PENDING', 'MANAGER_APPROVED', 'INFO_REQUESTED'] or (app_status == 'APPROVED' and not application.loanID):
                add_msg = "Loan ID generation is pending. " if (app_status == 'APPROVED' and not application.loanID) else ""
                response_data["message"] = f"Loan application found (Status: {status_display_from_app}). {add_msg}Not yet ready for payment processing."
            else: # REJECTED, CANCELLED
                response_data["message"] = f"Loan application found (Status: {status_display_from_app}). No payment action applicable for this loan."
            
            logger.info(f"Validation for: name='{first_name}', phone='{phone}'. Loan PK: {application.pk}, Status: {app_status}. Actionable: {response_data['actionable_payment']}. Message: {response_data['message']}")
            return Response(response_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error during LoanApplication validation for name='{first_name}', phone='{phone}': {e}", exc_info=True)
            return Response({
                "valid": False, "message": "An error occurred during validation.",
                "application": None, "actionable_payment": False
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)