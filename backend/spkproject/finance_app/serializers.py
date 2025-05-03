from rest_framework import serializers
from .models import Applicant, EmploymentDetails, BankingDetails, PropertyDetails

class ApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = [
            'userID', 'title', 'first_name', 'last_name', 
            'date_of_birth', 'gender', 'marital_status',
            'email', 'phone', 'address', 'city', 
            'state', 'postal_code'
        ]
        read_only_fields = ['userID']

class EmploymentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentDetails
        fields = [
            'employment_type', 'job_title', 'years_with_employer',
            'monthly_income', 'other_income'
        ]

class BankingDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankingDetails
        fields = [
            'account_holder_name', 'account_number', 'bank_name',
            'ifsc_code', 'bank_branch', 'account_type'
        ]

class PropertyDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyDetails
        fields = [
            'property_type', 'property_address', 'property_value',
            'property_age', 'property_ownership'
        ]

class LoanApplicationSerializer(serializers.Serializer):
    # Applicant fields
    userID = serializers.CharField(read_only=True)
    title = serializers.IntegerField()
    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)
    date_of_birth = serializers.DateField()
    gender = serializers.IntegerField()
    marital_status = serializers.IntegerField()
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15)
    address = serializers.CharField()
    city = serializers.CharField(max_length=50)
    state = serializers.CharField(max_length=50)
    postal_code = serializers.CharField(max_length=10)

    # Employment fields
    employment_type = serializers.CharField(max_length=20)
    job_title = serializers.CharField(max_length=100)
    years_with_employer = serializers.IntegerField(min_value=0)
    monthly_income = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)
    other_income = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0, default=0)

    # Banking fields
    account_holder_name = serializers.CharField(max_length=100)
    account_number = serializers.CharField(max_length=20)
    bank_name = serializers.CharField(max_length=100)
    ifsc_code = serializers.CharField(max_length=20)
    bank_branch = serializers.CharField(max_length=100)
    account_type = serializers.IntegerField()

    # Property fields
    property_type = serializers.CharField(max_length=20)
    property_address = serializers.CharField()
    property_value = serializers.DecimalField(max_digits=15, decimal_places=2, min_value=0)
    property_age = serializers.IntegerField(min_value=0)
    property_ownership = serializers.IntegerField()

    def create(self, validated_data):
        # Extract data for each model
        applicant_data = {
            'title': validated_data['title'],
            'first_name': validated_data['first_name'],
            'last_name': validated_data['last_name'],
            'date_of_birth': validated_data['date_of_birth'],
            'gender': validated_data['gender'],
            'marital_status': validated_data['marital_status'],
            'email': validated_data['email'],
            'phone': validated_data['phone'],
            'address': validated_data['address'],
            'city': validated_data['city'],
            'state': validated_data['state'],
            'postal_code': validated_data['postal_code']
        }

        employment_data = {
            'employment_type': validated_data['employment_type'],
            'job_title': validated_data['job_title'],
            'years_with_employer': validated_data['years_with_employer'],
            'monthly_income': validated_data['monthly_income'],
            'other_income': validated_data['other_income']
        }

        banking_data = {
            'account_holder_name': validated_data['account_holder_name'],
            'account_number': validated_data['account_number'],
            'bank_name': validated_data['bank_name'],
            'ifsc_code': validated_data['ifsc_code'],
            'bank_branch': validated_data['bank_branch'],
            'account_type': validated_data['account_type']
        }

        property_data = {
            'property_type': validated_data['property_type'],
            'property_address': validated_data['property_address'],
            'property_value': validated_data['property_value'],
            'property_age': validated_data['property_age'],
            'property_ownership': validated_data['property_ownership']
        }

        # Create Applicant
        applicant = Applicant.objects.create(**applicant_data)
        
        # Create related records
        EmploymentDetails.objects.create(applicant=applicant, **employment_data)
        BankingDetails.objects.create(applicant=applicant, **banking_data)
        PropertyDetails.objects.create(applicant=applicant, **property_data)

        return {
            'applicant': applicant,
            'status': 'Application submitted successfully'
        }