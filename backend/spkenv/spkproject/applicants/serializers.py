from rest_framework import serializers
from .models import Applicant, EmploymentDetails, PropertyDetails, ApplicantProof

class ApplicantProofSerializer(serializers.ModelSerializer):
    proof_file = serializers.FileField()  # Handles file uploads

    class Meta:
        model = ApplicantProof
        fields = ['proof_type', 'proof_number', 'proof_file']
class EmploymentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentDetails
        fields = '__all__'

class PropertyDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyDetails
        fields = '__all__'

class ApplicantSerializer(serializers.ModelSerializer):
    employment = EmploymentDetailsSerializer(many=True, required=False)
    properties = PropertyDetailsSerializer(many=True, required=False)

    class Meta:
        model = Applicant
        fields = '__all__'

    def create(self, validated_data):
        employment_data = validated_data.pop('employment', [])
        property_data = validated_data.pop('properties', [])

        applicant = Applicant.objects.create(**validated_data)

        for emp in employment_data:
            EmploymentDetails.objects.create(applicant=applicant, **emp)

        for prop in property_data:
            PropertyDetails.objects.create(applicant=applicant, **prop)

        return applicant
