from rest_framework import generics, status
from rest_framework.decorators import action  # Import the action decorator
from rest_framework.response import Response
from django.utils import timezone
from .models import EmployeeDetails
from .serializers import EmployeeSerializer

class EmployeeListCreateView(generics.ListCreateAPIView):
    """View to list all active employees and create new employees"""
    serializer_class = EmployeeSerializer
    
    def get_queryset(self):
        # Only return non-deleted employees
        return EmployeeDetails.objects.filter(is_deleted=False)

class EmployeeRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """View to retrieve, update, and soft-delete an employee"""
    serializer_class = EmployeeSerializer
    lookup_field = 'employeeID'
    
    def get_queryset(self):
        # Allow retrieval of deleted employees for restoration
        return EmployeeDetails.all_objects.all()
    
    def destroy(self, request, *args, **kwargs):
        """Override default delete to perform soft delete"""
        instance = self.get_object()
        
        # Check if already soft-deleted
        if instance.is_deleted:
            return Response(
                {"error": "Employee already deleted"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Perform soft delete
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def restore(self, request, *args, **kwargs):
        """Custom action to restore soft-deleted employees"""
        instance = self.get_object()
        
        # Check if not deleted
        if not instance.is_deleted:
            return Response(
                {"error": "Employee is not deleted"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Restore the employee
        instance.is_deleted = False
        instance.deleted_at = None
        instance.save()
        
        return Response(status=status.HTTP_200_OK)