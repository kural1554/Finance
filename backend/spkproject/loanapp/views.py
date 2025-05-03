# views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Q # Optional but good for case-insensitive search

from .models import LoanApplication, EMISchedule
from .serializers import LoanApplicationSerializer, EMIScheduleSerializer


class LoanApplicationViewSet(viewsets.ModelViewSet):
    queryset = LoanApplication.objects.all()
    serializer_class = LoanApplicationSerializer
    lookup_field = 'loanID'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Update LoanApplication fields
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Update EMI schedule if provided
        emi_data = request.data.get('emiSchedule')
        if isinstance(emi_data, list): # Check if it's a list
            for emi_item in emi_data:
                 # Ensure emi_item is a dictionary and has 'id'
                if isinstance(emi_item, dict) and 'id' in emi_item:
                    emi_id = emi_item.get('id')
                    if emi_id:
                        try:
                            emi_instance = EMISchedule.objects.get(id=emi_id, loan_application=instance)
                            # Use .get() with default to avoid KeyError if keys are missing
                            payment_amount = emi_item.get('paymentAmount')
                            pending_amount = emi_item.get('pendingAmount')

                            if payment_amount is not None:
                                emi_instance.paymentAmount = payment_amount
                            if pending_amount is not None:
                                emi_instance.pendingAmount = pending_amount

                            # Only save if something potentially changed
                            if payment_amount is not None or pending_amount is not None:
                                emi_instance.save()
                        except EMISchedule.DoesNotExist:
                            # Log this potential issue or handle as needed
                            print(f"Warning: EMI Schedule with id {emi_id} not found for application {instance.id}")
                            continue # Ignore if not found
                        except Exception as e:
                             # Log unexpected errors during EMI update
                            print(f"Error updating EMI {emi_id}: {e}")
                            # Decide if you want to stop the whole update or just skip this EMI
                            # For now, we continue
                            continue

        return Response(serializer.data)


    # --- Correct Indentation Starts Here ---
    @action(detail=False, methods=['POST'], url_path='validate')
    def validate_applicant(self, request):
        """
        Validates if a loan application exists for the given first name and phone.
        POST /api/apply-loan/loan-applications/validate/
        Body: {"first_name": "Example Name", "phone": "9876543210"}
        """
        first_name = request.data.get('first_name', '').strip()
        phone = request.data.get('phone', '').strip()

        if not first_name or not phone:
            return Response(
                {"valid": False, "message": "First name and phone number are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Case-insensitive search for first name
            application = LoanApplication.objects.get(
                first_name__iexact=first_name,
                phone=phone
            )
            # Use the viewset's serializer to ensure consistency and context
            serializer = self.get_serializer(application)
            return Response({
                "valid": True,
                "message": "Applicant validation successful. Loan details fetched.",
                "application": serializer.data # Return serialized data
            })
        except LoanApplication.DoesNotExist:
            return Response(
                {"valid": False, "message": "No matching loan application found for the provided details."},
                status=status.HTTP_404_NOT_FOUND
            )
        except LoanApplication.MultipleObjectsReturned:
             # This case might indicate data integrity issues
             # Log this error for investigation
             print(f"Error: Multiple applications found for name='{first_name}', phone='{phone}'")
             # Decide on the response: maybe return the first one, or an error
             # For now, return an error indicating ambiguity
             return Response(
                {"valid": False, "message": "Multiple matching applications found. Please contact support."},
                status=status.HTTP_409_CONFLICT # Conflict status might be appropriate
            )
        except Exception as e:
            # Log unexpected errors
            print(f"Unexpected error during applicant validation: {e}")
            return Response(
                {"valid": False, "message": "An unexpected error occurred during validation."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )