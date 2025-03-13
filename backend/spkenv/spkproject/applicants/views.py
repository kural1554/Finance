from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import Applicant
from .serializers import ApplicantSerializer

class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer
    parser_classes = (MultiPartParser, FormParser)  # Allow file uploads

    def create(self, request, *args, **kwargs):
        data = request.data
        proofs_data = []

        # Extract files from request
        for key in request.FILES:
            if key.startswith("proofs["):
                proof_type = int(request.data.get(f"{key[:-5]}.proof_type"))  # proof_type key
                proof_number = request.data.get(f"{key[:-5]}.proof_number")  # proof_number key
                proof_file = request.FILES[key]  # Get file

                proofs_data.append({
                    "proof_type": proof_type,
                    "proof_number": proof_number,
                    "proof_file": proof_file
                })

        data["proofs"] = proofs_data  # Add proofs to main data

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Applicant created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
