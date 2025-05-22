from rest_framework import serializers
from .models import LoanApplication, Nominee, EMISchedule

from applicants.models import Applicant 

class NomineeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nominee
        exclude = ['loan_application']

class EMIScheduleSerializer(serializers.ModelSerializer):
    paymentAmount = serializers.FloatField(required=False)
    pendingAmount = serializers.FloatField(required=False)

    class Meta:
        model = EMISchedule
        exclude = ['loan_application']

class LoanApplicationSerializer(serializers.ModelSerializer):
    nominees = NomineeSerializer(many=True, read_only=True)  # set read_only
    emiSchedule = EMIScheduleSerializer(many=True, read_only=True)  # set read_only

    applicant_userID_display = serializers.CharField(source='applicant_record.userID', read_only=True, allow_null=True)
    applicant_record = serializers.SlugRelatedField(
        slug_field='userID',  
        queryset=Applicant.all_objects.all(),
        allow_null=True, 
         required=True )


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
            'nominees',
            'emiSchedule'

        ]
        read_only_fields = ['loanID', 'applicant_userID_display', 'LoanRegDate']

