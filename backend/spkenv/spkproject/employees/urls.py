from django.urls import path
from .views import EmployeeListCreateView, EmployeeRetrieveUpdateDeleteView
 

urlpatterns = [
    path('', EmployeeListCreateView.as_view(), name='employees'),
    path('api/employees/<int:employeeID>/', EmployeeRetrieveUpdateDeleteView.as_view(), name='employee-detail'),
] 

