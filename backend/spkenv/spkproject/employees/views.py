from rest_framework import generics
from .models import EmployeeDetails
from .serializers import EmployeeSerializer

class EmployeeListCreateView(generics.ListCreateAPIView):
    """ View to list all employees and create a new employee """
    queryset = EmployeeDetails.objects.all()
    serializer_class = EmployeeSerializer

class EmployeeRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """ View to retrieve, update, and delete an employee """
    queryset = EmployeeDetails.objects.all()
    serializer_class = EmployeeSerializer
    lookup_field = 'employeeID'  # Use employeeID instead of id
