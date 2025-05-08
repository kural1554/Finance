from django.urls import path
from .views import EmployeeListCreateView, EmployeeRetrieveUpdateDeleteView

urlpatterns = [
    path('', EmployeeListCreateView.as_view(), name='employees'),
    path('<str:employeeID>/', EmployeeRetrieveUpdateDeleteView.as_view(), name='employee-detail'),
]

