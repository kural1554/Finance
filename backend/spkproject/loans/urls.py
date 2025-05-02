from django.urls import path
from .views import LoanDetailView

urlpatterns = [
    path('loan/<int:loan_id>/', LoanDetailView.as_view(), name='loan-detail'),
]
