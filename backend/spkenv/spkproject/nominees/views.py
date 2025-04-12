from rest_framework import viewsets
from .models import Nominee
from .serializers import NomineeSerializer

class NomineeViewSet(viewsets.ModelViewSet):
    queryset = Nominee.objects.all()
    serializer_class = NomineeSerializer
