# loanapp/serializers.py
from rest_framework import serializers
from .models import LoanApplication, Nominee, EMISchedule
from applicants.models import Applicant  # Assuming 'applicants.Applicant.all_objects' exists if you have a custom manager
from decimal import Decimal


class NomineeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nominee
        exclude = ['loan_application']

class EMIScheduleSerializer(serializers.ModelSerializer):
    paymentAmount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=Decimal('0.00'))
    pendingAmount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=Decimal('0.00'))
    interest = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=Decimal('0.00'))
    principalPaid = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=Decimal('0.00'))
    remainingBalance = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=Decimal('0.00'))
    emiTotalMonth = serializers.DecimalField(max_digits=10, decimal_places=2, required=True) # This should align with your model (DecimalField)
    
    payment_processed_by_username = serializers.CharField(source='payment_processed_by.username', read_only=True, allow_null=True)
    
    class Meta:
        model = EMISchedule
        fields = [
            'id', 'month', 'emiStartDate', 'emiTotalMonth', 
            'interest', 'principalPaid', 'remainingBalance', 
            'paymentAmount', 'pendingAmount',
            'payment_processed_by', # This field will be set by view logic, not directly from payload in this flow
            'payment_processed_by_username', 
            'payment_processed_at'
        ]
        # 'payment_processed_by' is not read_only here which is fine if view controls it.
        # If you wanted to ensure it's never part of incoming create/update data for this serializer, add it to read_only_fields.
        # However, the view logic is what matters for setting it.
        read_only_fields = ('payment_processed_by_username', 'payment_processed_at') 

class LoanApplicationSerializer(serializers.ModelSerializer):
    nominees = NomineeSerializer(many=True, read_only=True)
    emiSchedule = EMIScheduleSerializer(many=True, read_only=True)

    applicant_userID_display = serializers.CharField(source='applicant_record.userID', read_only=True, allow_null=True)
    applicant_record = serializers.SlugRelatedField(
        slug_field='userID',  
        queryset=Applicant.objects.all(), # Changed from Applicant.all_objects.all() for standard manager
        allow_null=True, 
        required=True 
    )
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = LoanApplication
        fields = [
            'id', 
            'loanID',
            'applicant_record',      
            'applicant_userID_display', 
            'first_name', 'phone', 'amount', 'term', 'termType',
            'interestRate', 'purpose', 'repaymentSource', 'agreeTerms',
            'agreeCreditCheck', 'agreeDataSharing', 'translatorName',
            'translatorPlace', 'LoanRegDate', 'remarks', 'manager_remarks',
            'admin_remarks',  'startDate',
            'status',
            'status_display', 
            'nominees',
            'emiSchedule'
        ]
        read_only_fields = [
            'id', 
            'loanID', 
            'applicant_userID_display', 
            'LoanRegDate', 
            'status_display'  
        ]