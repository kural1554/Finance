from django.urls import path
from .views import LoanApplicationListCreateView, LoanApplicationRetrieveUpdateDestroyView

urlpatterns = [
    path('loan-applications/', LoanApplicationListCreateView.as_view(), name='loan-application-list-create'),
    path('loan-applications/<int:pk>/', LoanApplicationRetrieveUpdateDestroyView.as_view(), name='loan-application-detail'),
]


