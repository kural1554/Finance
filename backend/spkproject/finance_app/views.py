from rest_framework import generics, status
from rest_framework.response import Response
from .models import Applicant
from .serializers import LoanApplicationSerializer, ApplicantSerializer

class LoanApplicationCreateView(generics.CreateAPIView):
    serializer_class = LoanApplicationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        
        response_data = {
            'userID': result['applicant'].userID,
            'message': result['status'],
            'status': 'success'
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)

class ApplicantDetailView(generics.RetrieveAPIView):
    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer
    lookup_field = 'userID'