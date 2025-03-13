from rest_framework import viewsets
from .models import BankDetails
from .serializers import BankDetailsSerializer

class BankDetailsViewSet(viewsets.ModelViewSet):
    queryset = BankDetails.objects.all()
    serializer_class = BankDetailsSerializer
