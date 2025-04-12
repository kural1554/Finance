from django.urls import path
from .views import LoanrequestListCreateView,LoanrequestRetrieveUpdateView

urlpatterns = [
    path('', LoanrequestListCreateView.as_view(), name='loan-list-create'),
    path('<int:pk>/', LoanrequestRetrieveUpdateView.as_view(), name='loan-request-rud'),
]