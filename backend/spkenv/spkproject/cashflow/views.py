from rest_framework import generics
from .models import Cashflow
from .serializers import CashflowSerializer

class CashflowListCreateView(generics.ListCreateAPIView):
    """View to list all cashflows and create a new cashflow"""
    queryset = Cashflow.objects.all()
    serializer_class = CashflowSerializer

class CashflowRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """View to retrieve, update, and delete a cashflow record"""
    queryset = Cashflow.objects.all()
    serializer_class = CashflowSerializer
    lookup_field = 'id'  # Default lookup field

