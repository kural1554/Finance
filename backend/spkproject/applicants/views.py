<<<<<<< HEAD:backend/spkenv/spkproject/applicants/views.py
from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Applicant, ApplicantProof, EmploymentDetails, PropertyDetails, BankingDetails
from .serializers import ApplicantSerializer, ApplicantProofSerializer, EmploymentDetailsSerializer, PropertyDetailsSerializer, BankingDetailsSerializer
import json
from rest_framework.views import APIView
from django.http import QueryDict
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from django.db import transaction
from rest_framework import viewsets, status, mixins

from rest_framework.exceptions import ValidationError, NotFound




from .models import Applicant, ApplicantProof, EmploymentDetails, PropertyDetails, BankingDetails
from .serializers import (
    ApplicantSerializer,
    ApplicantProofSerializer,
    EmploymentDetailsSerializer,
    PropertyDetailsSerializer,
    BankingDetailsSerializer
)
import logging

logger = logging.getLogger(__name__)

class ApplicantViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows applicants to be viewed or edited.
    """
    queryset = Applicant.objects.filter(is_deleted=False)
    serializer_class = ApplicantSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    lookup_field = 'id'

    def get_queryset(self):
        """
        Optionally filters the queryset by name, phone, or email.
        """
        queryset = super().get_queryset()
        
        # Filtering parameters
        name = self.request.query_params.get('name')
        phone = self.request.query_params.get('phone')
        email = self.request.query_params.get('email')
        
        if name:
            queryset = queryset.filter(first_name__icontains=name)
        if phone:
            queryset = queryset.filter(phone=phone)
        if email:
            queryset = queryset.filter(email__iexact=email)
            
        return queryset

    def _validate_uniqueness(self, data, instance=None):
        """
        Validates uniqueness constraints for phone+name and email.
        """
        errors = {}
        
        # Phone + name combination check
        phone = data.get('phone')
        first_name = data.get('first_name')
        if phone and first_name:
            qs = self.queryset.filter(phone=phone, first_name__iexact=first_name)
            if instance:
                qs = qs.exclude(id=instance.id)
            if qs.exists():
                errors['non_field_errors'] = ["User with this phone and name already exists."]
        
        # Email uniqueness check
        email = data.get('email')
        if email:
            qs = self.queryset.filter(email__iexact=email)
            if instance:
                qs = qs.exclude(id=instance.id)
            if qs.exists():
                errors['email'] = ["This email is already in use."]
        
        if errors:
            raise ValidationError(errors)

    def _handle_file_uploads(self, request, data):
        """
        Processes file uploads in the request data.
        """
        # Handle profile photo
        if 'profile_photo' in request.FILES:
            data['profile_photo'] = request.FILES['profile_photo']
        elif 'profile_photo' not in data:
            data.pop('profile_photo', None)
        
        # Handle proof files
        if any(key.startswith('proofs[') for key in request.FILES):
            proofs_data = []
            for key in request.FILES:
                if key.startswith('proofs['):
                    index = key.split('[')[1].split(']')[0]
                    proof_type = request.data.get(f'proofs[{index}]type')
                    id_number = request.data.get(f'proofs[{index}]idNumber')
                    if proof_type and id_number:
                        proofs_data.append({
                            'type': proof_type,
                            'idNumber': id_number,
                            'file': request.FILES[key]
                        })
            if proofs_data:
                data['proofs'] = proofs_data
        
        return data

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """
        Creates a new applicant with nested relationships.
        """
        try:
            data = request.data.copy()
            data = self._handle_file_uploads(request, data)
            self._validate_uniqueness(data)
            
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            headers = self.get_success_headers(serializer.data)
            return Response(
                {
                    'status': 'success',
                    'message': 'Applicant created successfully',
                    'data': serializer.data
                },
                status=status.HTTP_201_CREATED,
                headers=headers
            )
            
        except ValidationError as e:
            logger.error(f'Validation error creating applicant: {e}')
            return Response(
                {
                    'status': 'error',
                    'errors': e.detail
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f'Error creating applicant: {e}')
            return Response(
                {
                    'status': 'error',
                    'message': 'An unexpected error occurred'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        """
        Fully updates an existing applicant.
        """
        try:
            instance = self.get_object()
            data = request.data.copy()
            data = self._handle_file_uploads(request, data)
            self._validate_uniqueness(data, instance)
            
            serializer = self.get_serializer(instance, data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            return Response(
                {
                    'status': 'success',
                    'message': 'Applicant updated successfully',
                    'data': serializer.data
                },
                status=status.HTTP_200_OK
            )
            
        except ValidationError as e:
            logger.error(f'Validation error updating applicant: {e}')
            return Response(
                {
                    'status': 'error',
                    'errors': e.detail
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f'Error updating applicant: {e}')
            return Response(
                {
                    'status': 'error',
                    'message': 'An unexpected error occurred'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @transaction.atomic
    def partial_update(self, request, *args, **kwargs):
        """
        Partially updates an existing applicant, including nested fields.
        """
        try:
            instance = self.get_object()
            data = request.data.copy()
            data = self._handle_file_uploads(request, data)

            # Parse JSON strings for nested fields if needed
            for field in ['employment', 'banking_details', 'properties', 'proofs']:
                if field in data and isinstance(data[field], str):
                    try:
                        data[field] = json.loads(data[field])
                    except Exception:
                        pass

            # Only validate fields that are being updated
            validation_data = {
                k: v for k, v in data.items()
                if k in ['phone', 'first_name', 'email']
            }
            if validation_data:
                self._validate_uniqueness(validation_data, instance)

            serializer = self.get_serializer(
                instance,
                data=data,
                partial=True
            )
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            return Response(
                {
                    'status': 'success',
                    'message': 'Applicant updated successfully',
                    'data': serializer.data
                },
                status=status.HTTP_200_OK
            )

        except ValidationError as e:
            logger.error(f'Validation error partially updating applicant: {e}')
            return Response(
                {
                    'status': 'error',
                    'errors': e.detail
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f'Error partially updating applicant: {e}')
            return Response(
                {
                    'status': 'error',
                    'message': 'An unexpected error occurred'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['PATCH'])
    def soft_delete(self, request, pk=None):
        """
        Custom action to soft delete an applicant.
        """
        try:
            applicant = self.get_object()
            applicant.is_deleted = True
            applicant.save()
            
            return Response(
                {
                    'status': 'success',
                    'message': 'Applicant soft deleted successfully'
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f'Error soft deleting applicant: {e}')
            return Response(
                {
                    'status': 'error',
                    'message': 'Failed to soft delete applicant'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['PATCH'])
    def restore(self, request, pk=None):
        """
        Custom action to restore a soft-deleted applicant.
        """
        try:
            applicant = self.get_object()
            applicant.is_deleted = False
            applicant.save()
            
            return Response(
                {
                    'status': 'success',
                    'message': 'Applicant restored successfully'
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f'Error restoring applicant: {e}')
            return Response(
                {
                    'status': 'error',
                    'message': 'Failed to restore applicant'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Legacy function-based views (can be deprecated gradually)
@csrf_exempt
def validate_applicant(request):
    """
    Legacy endpoint to validate an applicant.
    """
    if request.method == 'POST':
        view = ApplicantViewSet.as_view({'post': 'create'})
        return view(request._request)
    return JsonResponse(
        {'error': 'Only POST method allowed'}, 
        status=status.HTTP_405_METHOD_NOT_ALLOWED
    )

@csrf_exempt
def delete_applicant(request, applicant_id):
    """
    Legacy endpoint to delete an applicant.
    """
    if request.method == 'DELETE':
        view = ApplicantViewSet.as_view({'delete': 'destroy'})
        return view(request._request, pk=applicant_id)
    return JsonResponse(
        {'error': 'Only DELETE method allowed'}, 
        status=status.HTTP_405_METHOD_NOT_ALLOWED
    )

@csrf_exempt
def restore_applicant(request, applicant_id):
    """
    Legacy endpoint to restore an applicant.
    """
    if request.method == 'PATCH':
        view = ApplicantViewSet.as_view({'patch': 'restore'})
        return view(request._request, pk=applicant_id)
    return JsonResponse(
        {'error': 'Only PATCH method allowed'}, 
        status=status.HTTP_405_METHOD_NOT_ALLOWED
    )
class LoanFormView(APIView):
    def destroy(self, request, *args, **kwargs):
        # Fetch the loan form data (if any)
        loan_form_data = LoanApplication.objects.all()
        serializer = LoanApplicationSerializer(loan_form_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
# Applicant Validation API (before loan process)
@csrf_exempt
def validate_applicant(request):
    if request.method == 'POST':
        try:
            # Parse the incoming JSON data
            data = json.loads(request.body)
            first_name = data.get('first_name')
            phone = data.get('phone')

            if not first_name or not phone:
                return JsonResponse({'valid': False, 'error': 'Missing first_name or phone'}, status=400)

            # Match both first_name and phone
            applicant = Applicant.objects.filter(first_name=first_name, phone=phone).first()

            if not applicant:
                return JsonResponse({'valid': False, 'error': 'Applicant not found'}, status=404)

            # Build profile photo URL if it exists
            profile_photo_url = None
            if applicant.profile_photo:
                try:
                    profile_photo_url = request.build_absolute_uri(applicant.profile_photo.url)
                except ValueError:
                    # Handle case where the file doesn't exist or other file-related errors
                    profile_photo_url = None

            # Prepare response data
            applicant_data = {
                "userID": applicant.userID,
                "loan_id": applicant.loan_id,
                "loanreg_date": str(applicant.loanreg_date),
                "title": applicant.title,
                "first_name": applicant.first_name,
                "last_name": applicant.last_name,
                "dateOfBirth": str(applicant.dateOfBirth) if applicant.dateOfBirth else None,
                "gender": applicant.gender,
                "maritalStatus": applicant.maritalStatus,
                "email": applicant.email,
                "phone": applicant.phone,
                "address": applicant.address,
                "city": applicant.city,
                "state": applicant.state,
                "postalCode": applicant.postalCode,
                "profile_photo": profile_photo_url,  # Use the constructed URL or None
                "is_approved": applicant.is_approved,
                "ApplicantProof": list(applicant.ApplicantProof.values("id", "file", "type", "idNumber")),
                "employment": list(applicant.employment.values(
                    "id", "employmentType", "jobTitle", "yearsWithEmployer", "monthlyIncome", "otherIncome"
                )),
                "properties": list(applicant.properties.values(
                    "id", "propertyType", "property_address", "propertyValue",
                    "propertyAge", "propertyOwnership", "is_deleted", "remarks"
                )),
                "banking_details": list(applicant.banking_details.values(
                    "id", "accountHolderName", "accountNumber", "bankName", "ifscCode", "bankBranch", "accountType"
                ))
            }

            return JsonResponse({'valid': True, 'applicant': applicant_data}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'valid': False, 'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'valid': False, 'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST method allowed'}, status=405)

# Soft delete applicant (mark as deleted without removing)
@csrf_exempt
def delete_applicant(request, applicant_id):
    if request.method == 'DELETE':
        try:
            applicant = Applicant.objects.get(id=applicant_id)
            applicant.is_deleted = True  # Mark the applicant as deleted
            applicant.save(update_fields=['is_deleted'])  # Save the change to the database
            return JsonResponse({"status": "success", "message": "Applicant soft deleted successfully"}, status=200)
        except Applicant.DoesNotExist:
            return JsonResponse({"status": "error", "error": "Applicant not found"}, status=404)

    return JsonResponse({'error': 'Only DELETE method allowed'}, status=405)

# Restore applicant (mark as not deleted)
@csrf_exempt
def restore_applicant(request, applicant_id):
    if request.method == 'PATCH':
        try:
            applicant = Applicant.objects.get(id=applicant_id)
            applicant.is_deleted = False  # Mark as not deleted
            applicant.save(update_fields=['is_deleted'])
            return JsonResponse({"status": "success", "message": "Applicant restored successfully"}, status=200)
        except Applicant.DoesNotExist:
            return JsonResponse({"status": "error", "error": "Applicant not found"}, status=404)

    return JsonResponse({'error': 'Only PATCH method allowed'}, status=405)

# Optional: You can define additional APIs for handling updates, deletions, and more. 
# Example for updating an applicant:
@csrf_exempt
def update_applicant(request, applicant_id):
    if request.method == 'PUT':
        try:
            applicant = Applicant.objects.get(id=applicant_id)
            data = json.loads(request.body)
            serializer = ApplicantSerializer(applicant, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return JsonResponse({"status": "success", "data": serializer.data}, status=200)

            return JsonResponse({"status": "error", "errors": serializer.errors}, status=400)

        except Applicant.DoesNotExist:
            return JsonResponse({"status": "error", "error": "Applicant not found"}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "error": "Invalid JSON format"}, status=400)
        except Exception as e:
            return JsonResponse({"status": "error", "error": str(e)}, status=500)

    return JsonResponse({'error': 'Only PUT method allowed'}, status=405)
@api_view(['PUT', 'PATCH'])
def update(self, request, *args, **kwargs):
    partial = kwargs.pop('partial', False)
    applicant_instance = self.get_object()
    
    # Convert request.data to a mutable copy
    data = request.data.copy()

    # Only validate fields that are actually being updated
    phone = data.get('phone', None)
    first_name = data.get('first_name', None)
    email = data.get('email', None)

    # Check for duplicate phone + name only if both are being updated
    if phone is not None and first_name is not None:
        if Applicant.objects.filter(phone=phone, first_name__iexact=first_name).exclude(id=applicant_instance.id).exists():
            return Response({
                "status": "error",
                "message": "User with same name and phone number already exists"
            }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check for duplicate email only if email is being updated
    if email is not None and email != applicant_instance.email:
        if Applicant.objects.filter(email=email).exclude(id=applicant_instance.id).exists():
            return Response({
                "status": "error",
                "message": "Email already exists"
            }, status=status.HTTP_400_BAD_REQUEST)

    # Handle file-based proof updates if provided
    proofs_data = []
    for key in request.FILES:
        if key.startswith("proofs["):
            proof_type = request.data.get(f"{key[:-5]}type", "")
            id_number = request.data.get(f"{key[:-5]}idNumber", "")
            file = request.FILES[key]
            proofs_data.append({
                "type": proof_type,
                "id_number": id_number,
                "file": file
            })
    
    if proofs_data:
        data["proofs"] = proofs_data

    # Perform update with partial=True for PATCH requests
    serializer = self.get_serializer(applicant_instance, data=data, partial=partial)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            "status": "success",
            "message": "Applicant updated successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    return Response({
        "status": "error",
        "errors": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def get_applicant(request, applicant_id):
    try:
        applicant = Applicant.objects.get(id=applicant_id)
        serializer = ApplicantSerializer(applicant)
        return Response({
            "status": "success",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    except Applicant.DoesNotExist:
        return Response({
            "status": "error",
            "message": "Applicant not found"
        }, status=status.HTTP_404_NOT_FOUND)
@api_view(['PUT', 'PATCH'])
def update_applicant(request, applicant_id):
    try:
        applicant = Applicant.objects.get(id=applicant_id)
        
        # For partial updates (PATCH), use partial=True
        partial = request.method == 'PATCH'
        serializer = ApplicantSerializer(applicant, data=request.data, partial=partial)
        
        # Check for duplicate phone + name combination
        phone = request.data.get('phone')
        first_name = request.data.get('first_name')
        
        if phone and first_name:
            if Applicant.objects.filter(phone=phone, first_name__iexact=first_name).exclude(id=applicant_id).exists():
                return Response({
                    "status": "error",
                    "message": "User with same name and phone number already exists"
                }, status=status.HTTP_400_BAD_REQUEST)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": "success",
                "message": "Applicant updated successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
            
        return Response({
            "status": "error",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Applicant.DoesNotExist:
        return Response({
            "status": "error",
            "message": "Applicant not found"
        }, status=status.HTTP_404_NOT_FOUND)
@api_view(['PATCH'])
def partial_update_applicant(request, applicant_id):
    """
    Handle partial updates to an applicant record, including nested relationships.
    This function properly handles updating specific fields within nested objects.
    """
    try:
        applicant = Applicant.objects.get(id=applicant_id)
        
        # Get the data from the request
        data = request.data.copy()

        for field in ['employment', 'banking_details', 'properties', 'proofs']:
            if field in data and isinstance(data[field], str):
                try:
                    data[field] = json.loads(data[field])
                except Exception:
                    pass
        
        # Handle simple field updates (top-level fields)
        for field in data:
            if field not in ['employment', 'properties', 'banking_details', 'proofs']:
                setattr(applicant, field, data[field])
        
        # Save the top-level fields
        applicant.save()
        
        # Handle nested employment updates
        if 'employment' in data and isinstance(data['employment'], list):
            for emp_data in data['employment']:
                if 'id' in emp_data:
                    # Update existing employment record
                    emp = EmploymentDetails.objects.filter(id=emp_data['id'], applicant=applicant).first()
                    if emp:
                        for field, value in emp_data.items():
                            if field != 'id':
                                setattr(emp, field, value)
                        emp.save()
                else:
                    # Create new employment record
                    EmploymentDetails.objects.create(applicant=applicant, **emp_data)
        
        # Handle nested property updates
        if 'properties' in data and isinstance(data['properties'], list):
            for prop_data in data['properties']:
                if 'id' in prop_data:
                    # Update existing property record
                    prop = PropertyDetails.objects.filter(id=prop_data['id'], applicant=applicant).first()
                    if prop:
                        for field, value in prop_data.items():
                            if field != 'id':
                                setattr(prop, field, value)
                        prop.save()
                else:
                    # Create new property record
                    PropertyDetails.objects.create(applicant=applicant, **prop_data)
        
        # Handle nested banking details updates
        if 'banking_details' in data and isinstance(data['banking_details'], list):
            for bank_data in data['banking_details']:
                if 'id' in bank_data:
                    # Update existing banking record
                    bank = BankingDetails.objects.filter(id=bank_data['id'], applicant=applicant).first()
                    if bank:
                        for field, value in bank_data.items():
                            if field != 'id':
                                setattr(bank, field, value)
                        bank.save()
                else:
                    # Create new banking record
                    BankingDetails.objects.create(applicant=applicant, **bank_data)
        
        # Handle nested proof updates
        if 'proofs' in data and isinstance(data['proofs'], list):
            valid_proofs = [
                proof_data for proof_data in data['proofs']
                if proof_data.get('type') and proof_data.get('idNumber')
            ]
            for proof_data in valid_proofs:
                if 'id' in proof_data:
                    # Update existing proof record
                    proof = ApplicantProof.objects.filter(id=proof_data['id'], applicant=applicant).first()
                    if proof:
                        for field, value in proof_data.items():
                            if field != 'id' and field != 'file':  # Skip file field for now
                                setattr(proof, field, value)
                        
                        # Handle file update if present
                        if 'file' in proof_data and proof_data['file']:
                            proof.file = proof_data['file']
                        
                        proof.save()
                else:
                    # Create new proof record
                    ApplicantProof.objects.create(applicant=applicant, **proof_data)
        
        # Return the updated applicant data
        serializer = ApplicantSerializer(applicant)
        return Response({
            "status": "success",
            "message": "Applicant updated successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
        
    except Applicant.DoesNotExist:
        return Response({
            "status": "error",
            "message": "Applicant not found"
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "status": "error",
            "message": str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
=======
from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Applicant
from .serializers import ApplicantSerializer
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer
    parser_classes = [MultiPartParser, FormParser]  # For file uploads

    def create(self, request, *args, **kwargs):
        data = request.data
        proofs_data = []

        # ✅ Extract required fields for validation
        phone = data.get('phone')
        email = data.get('email')
        first_name = data.get('first_name')

        # ✅ Validate name + phone
        if Applicant.objects.filter(phone=phone, first_name__iexact=first_name).exists():
            return Response({
                "status": "error",
                "message": "User with same name and phone number already exists"
            }, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Optional: Email validation
        if email and Applicant.objects.filter(email=email).exists():
            return Response({
                "status": "error",
                "message": "Email already exists"
            }, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Handle proofs (file uploads)
        for key in request.FILES:
            if key.startswith("proofs["):
                type = int(request.data.get(f"{key[:-5]}.proof_type", 0))
                idNumber = request.data.get(f"{key[:-5]}.proof_number", "")
                file = request.FILES[key]

                proofs_data.append({
                    "type": type,
                    "idNumber": idNumber,
                    "file": file
                })

        data["proofs"] = proofs_data

        # ✅ Save data using serializer
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": "success",
                "message": "Applicant created successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Additional validation API to check before creating applicant
@csrf_exempt
def validate_applicant(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            first_name = data.get('first_name')
            phone = data.get('phone')

            if not first_name or not phone:
                return JsonResponse({'valid': False, 'error': 'Missing first_name or phone'}, status=400)

            # Match both first_name and phone
            applicant = Applicant.objects.filter(first_name=first_name, phone=phone).first()

            if not applicant:
                return JsonResponse({'valid': False, 'error': 'Applicant not found'}, status=404)

            # Prepare response data
            applicant_data = {
                "userID": applicant.userID,
                "loan_id": applicant.loan_id,
                "loanreg_date": str(applicant.loanreg_date),
                "title": applicant.title,
                "first_name": applicant.first_name,
                "last_name": applicant.last_name,
                "dateOfBirth": str(applicant.dateOfBirth) if applicant.dateOfBirth else None,
                "gender": applicant.gender,
                "maritalStatus": applicant.maritalStatus,
                "email": applicant.email,
                "phone": applicant.phone,
                "address": applicant.address,
                "city": applicant.city,
                "state": applicant.state,
                "postalCode": applicant.postalCode,
                "profile_photo": applicant.profile_photo.url if applicant.profile_photo else None,
                "is_approved": applicant.is_approved,
                "ApplicantProof": list(applicant.ApplicantProof.values("id", "file", "type", "idNumber")),
                "employment": list(applicant.employment.values(
                    "id", "employmentType", "jobTitle", "yearsWithEmployer", "monthlyIncome", "otherIncome"
                )),
                "properties": list(applicant.properties.values(
                    "id", "propertyType", "property_address", "propertyValue",
                    "propertyAge", "propertyOwnership", "is_deleted", "remarks"
                )),
                "banking_details": list(applicant.banking_details.values(
                    "id", "accountHolderName", "accountNumber", "bankName", "ifscCode", "bankBranch", "accountType"
                ))
            }

            return JsonResponse({'valid': True, 'applicant': applicant_data}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'valid': False, 'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'valid': False, 'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST method allowed'}, status=405)
>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4:backend/spkproject/applicants/views.py
