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