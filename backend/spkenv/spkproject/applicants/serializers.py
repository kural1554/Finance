from rest_framework import serializers
from .models import Applicant, EmploymentDetails, PropertyDetails, ApplicantProof, BankingDetails


class ApplicantProofSerializer(serializers.ModelSerializer):
    file = serializers.FileField()  # Handles file uploads
    class Meta:
        model = ApplicantProof
        exclude = ['applicant']


class EmploymentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentDetails
        exclude = ['applicant']  # applicant will be assigned in code


class PropertyDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyDetails
        exclude = ['applicant']


class BankingDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankingDetails
        exclude = ['applicant']


class ApplicantSerializer(serializers.ModelSerializer):
    employment = EmploymentDetailsSerializer(many=True, required=False)
    properties = PropertyDetailsSerializer(many=True, required=False)
    banking_details = BankingDetailsSerializer(many=True, required=False)
    ApplicantProof= ApplicantProofSerializer(many=True, required=False)

    class Meta:
        model = Applicant
        fields = '__all__'  # Include all fields from Applicant

    def create(self, validated_data):
        employment_data = validated_data.pop('employment', [])
        property_data = validated_data.pop('properties', [])
        banking_data = validated_data.pop('banking_details', [])
        ApplicantProof_data = validated_data.pop('ApplicantProof', [])
        
        applicant = Applicant.objects.create(**validated_data)

        # Create related employment records
        for emp in employment_data:
            EmploymentDetails.objects.create(applicant=applicant, **emp)

        # Create related property records
        for prop in property_data:
            PropertyDetails.objects.create(applicant=applicant, **prop)
        
        for proof in ApplicantProof_data:
            ApplicantProof.objects.create(applicant=applicant, **proof)

        # Create related bank records
        for bank in banking_data:
            BankingDetails.objects.create(applicant=applicant, **bank)

        return applicant

    def update(self, instance, validated_data):
        employment_data = validated_data.pop('employment', None)
        property_data = validated_data.pop('properties', None)
        banking_data = validated_data.pop('banking_details', None)
        ApplicantProof_data = validated_data.pop('ApplicantProof',None)


        # Update basic fields of applicant
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update nested employment
        if employment_data is not None:
            instance.employment.all().delete()
            for emp in employment_data:
                EmploymentDetails.objects.create(applicant=instance, **emp)

        # Update nested property
        if property_data is not None:
            instance.properties.all().delete()
            for prop in property_data:
                PropertyDetails.objects.create(applicant=instance, **prop)

        # Update nested banking
        if banking_data is not None:
            instance.banking_details.all().delete()
            for bank in banking_data:
                BankingDetails.objects.create(applicant=instance, **bank)
         # Update nested banking
        if ApplicantProof_data is not None:
            instance.ApplicantProof.all().delete()
            for proof in ApplicantProof_data:
               ApplicantProof.objects.create(applicant=instance, **proof)        

        return instance
