from django.urls import path
from .views import LoanApplicationCreateView, ApplicantDetailView

urlpatterns = [
    path('applications/', LoanApplicationCreateView.as_view(), name='loan-application'),
    path('applications/<str:userID>/', ApplicantDetailView.as_view(), name='applicant-detail'),
]