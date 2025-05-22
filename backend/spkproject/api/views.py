from rest_framework.views import APIView
from rest_framework.response import Response
from applicants.models import Applicant
from loans.models import Loan
from banking.models import BankDetails
from nominees.models import Nominee
from employees.models import EmployeeDetails

from applicants.serializers import ApplicantSerializer
from loans.serializers import LoanSerializer
from banking.serializers import BankDetailsSerializer
from nominees.serializers import NomineeSerializer
from employees.serializers import EmployeeSerializer

class CombinedDataView(APIView):
    def get(self, request):
        applicants = ApplicantSerializer(Applicant.objects.all(), many=True).data
        loans = LoanSerializer(Loan.objects.all(), many=True).data
        
        
        employees = EmployeeSerializer(EmployeeDetails.objects.all(), many=True).data

        return Response({
            "applicants": applicants,
            "loans": loans,
            
            "employees": employees
        })
