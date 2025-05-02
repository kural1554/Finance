<<<<<<< HEAD:backend/spkenv/spkproject/loanapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoanApplicationViewSet

router = DefaultRouter()
router.register(r'loan-applications', LoanApplicationViewSet, basename='loan-application')

urlpatterns = [
    path('', include(router.urls)),
]






=======
from django.urls import path
from .views import LoanApplicationListCreateView, LoanApplicationRetrieveUpdateDestroyView

urlpatterns = [
    path('loan-applications/', LoanApplicationListCreateView.as_view(), name='loan-application-list-create'),
    path('loan-applications/<int:pk>/', LoanApplicationRetrieveUpdateDestroyView.as_view(), name='loan-application-detail'),
]


>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4:backend/spkproject/loanapp/urls.py
