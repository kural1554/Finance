from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import Cashflow
from .serializers import CashflowSerializer

class CashflowListCreateView(generics.ListCreateAPIView):
    """View to list all non-deleted cashflows and create a new cashflow"""
    queryset = Cashflow.objects.filter(is_deleted=False)
    serializer_class = CashflowSerializer

class CashflowRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """View to retrieve, update, and soft delete a cashflow record"""
    queryset = Cashflow.objects.filter(is_deleted=False)
    serializer_class = CashflowSerializer
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        """Soft delete instead of hard delete"""
        instance = self.get_object()
        instance.is_deleted = True
        instance.save()
        return Response({"message": "Cashflow record soft deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
