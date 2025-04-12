from rest_framework import viewsets
from .models import PropertyDetails
from .serializers import PropertyDetailsSerializer

class PropertyDetailsViewSet(viewsets.ModelViewSet):
    queryset = PropertyDetails.objects.all()
    serializer_class = PropertyDetailsSerializer
