from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import ValidationError, PermissionDenied, NotAuthenticated
from rest_framework.decorators import action, api_view # Ensure api_view is imported
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist # Use Django's standard ObjectDoesNotExist
import logging

from .models import Applicant # Import Applicant model
from .serializers import ApplicantSerializer

logger = logging.getLogger(__name__)

# --- Main ViewSet for Applicant CRUD ---
class ApplicantViewSet(viewsets.ModelViewSet):
    # Default queryset uses Applicant.objects (which points to ActiveApplicantsManager)
    queryset = Applicant.objects.all().order_by('-loanreg_date')
    serializer_class = ApplicantSerializer
    parser_classes = [MultiPartParser, FormParser]
  

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
      
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
           
            return Response({'status': 'success','data': serializer.data,'message': 'Applicant created successfully.'}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
           
            return Response({'status': 'error','errors': e.detail, 'message': 'Validation failed.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
           
            return Response({'status': 'error','message': 'Unexpected server error.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def perform_update(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        # Keep existing update logic
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        try:
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            # Re-serialize updated instance
            serializer = self.get_serializer(instance)
            
            return Response({'status': 'success','data': serializer.data,'message': 'Applicant updated successfully.'}, status=status.HTTP_200_OK)
        except ValidationError as e:
            
            return Response({'status': 'error','errors': e.detail,'message': 'Validation failed.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            
            return Response({'status': 'error','message': 'Unexpected server error.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def destroy(self, request, *args, **kwargs):
        # Use all_objects to find regardless of is_deleted status
        instance = get_object_or_404(Applicant.all_objects, pk=kwargs['pk'])
        
        if instance.is_deleted:
           
            return Response(status=status.HTTP_204_NO_CONTENT)
        try:
            if hasattr(instance, 'soft_delete'): instance.soft_delete()
            else: instance.is_deleted = True; instance.save(update_fields=['is_deleted'])
           
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            
            return Response({'status': 'error', 'message': 'Error deleting applicant.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], url_path='restore')
    def restore_applicant(self, request, pk=None):
        # Use all_objects to find the instance
        instance = get_object_or_404(Applicant.all_objects, pk=pk)
        
        if not instance.is_deleted:
            return Response({'status': 'info', 'message': 'Applicant is already active.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            if hasattr(instance, 'restore'): instance.restore()
            else: instance.is_deleted = False; instance.save(update_fields=['is_deleted'])
            
            serializer = self.get_serializer(instance)
            return Response({'status': 'success', 'message': 'Applicant restored.', 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
           
            return Response({'status': 'error', 'message': 'Error restoring applicant.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
def validate_applicant_view(request):
   
   

   
    if not isinstance(request.data, dict):
       
        return Response({
            "valid": False,
            "error": "Invalid request format."
            }, status=status.HTTP_400_BAD_REQUEST)

    first_name = request.data.get('first_name')
    phone = request.data.get('phone')

    if not first_name or not phone:
        
        return Response({
            "valid": False,
            "error": "First name and phone number are required."
            }, status=status.HTTP_400_BAD_REQUEST)

    

    try:
        
        applicant = Applicant.objects.get(
            first_name__iexact=first_name.strip(), 
            phone=phone.strip()                  
        )
        
        # Return success with applicant info
        return Response({
            "valid": True,
            "message": f"Applicant {applicant.first_name} {applicant.last_name} verified.",
            "applicant_id": applicant.id
            }, status=status.HTTP_200_OK)

    except ObjectDoesNotExist:
        
        return Response({
            "valid": False,
            "error": "Active applicant with matching name and phone not found."
            }, status=status.HTTP_404_NOT_FOUND)
    except Applicant.MultipleObjectsReturned:
        
         return Response({
            "valid": False,
            "error": "Data inconsistency: Multiple matching active applicants found."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        
        return Response({
            "valid": False,
            "error": "An error occurred during validation."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# --- End Validation View ---