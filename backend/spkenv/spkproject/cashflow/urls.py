from django.urls import path
from .views import CashflowListCreateView, CashflowRetrieveUpdateDeleteView

urlpatterns = [
    path('', CashflowListCreateView.as_view(), name='cashflow-list-create'),
    path('<int:id>/', CashflowRetrieveUpdateDeleteView.as_view(), name='cashflow-detail'),
]
