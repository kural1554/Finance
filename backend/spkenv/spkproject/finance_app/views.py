from rest_framework import viewsets
from rest_framework.response import Response
from .models import Loan, Employment, BankDetails
from .serializers import LoanSerializer, EmploymentSerializer, BankDetailsSerializer

class AllDetailsViewSet(viewsets.ViewSet):
    def list(self, request):
        loans = Loan.objects.all()
        employments = Employment.objects.all()
        bank_details = BankDetails.objects.all()

        response_data = {
            "loans": LoanSerializer(loans, many=True).data,
            "employments": EmploymentSerializer(employments, many=True).data,
            "bank_details": BankDetailsSerializer(bank_details, many=True).data
        }
        return Response(response_data)
