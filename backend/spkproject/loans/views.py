from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Loan
from .serializers import LoanSerializer

class LoanDetailView(APIView):
    def get(self, request, loan_id):
        """ Retrieve loan details by loan_id (not primary key id) """
        loan = get_object_or_404(Loan, loan_id=loan_id)  # Fetch by loan_id, not id
        serializer = LoanSerializer(loan)
        return Response(serializer.data, status=status.HTTP_200_OK)
