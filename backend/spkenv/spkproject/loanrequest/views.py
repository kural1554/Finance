# loanrequest/views.py
from rest_framework import generics
from .models import LoanRequest
from .serializers import LoanRequestSerializer 

class LoanrequestListCreateView(generics.ListCreateAPIView):
    queryset = LoanRequest.objects.all()
    serializer_class = LoanRequestSerializer

class LoanrequestRetrieveUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LoanRequest.objects.all()
    serializer_class = LoanRequestSerializer