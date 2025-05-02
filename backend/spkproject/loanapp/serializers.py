<<<<<<< HEAD:backend/spkenv/spkproject/loanapp/serializers.py
from rest_framework import serializers
from .models import LoanApplication, Nominee, EMISchedule
import json

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

    class Meta:
        model = LoanApplication
        fields = '__all__'

    def create(self, validated_data):
        request = self.context.get('request')
        data = request.data

        loan = LoanApplication.objects.create(
            first_name=data.get('first_name'),
            phone=data.get('phone'),
            amount=data.get('amount'),
            term=data.get('term'),
            termType=data.get('termType'),
            interestRate=data.get('interestRate'),
            purpose=data.get('purpose'),
            repaymentSource=data.get('repaymentSource'),
            agreeTerms=json.loads(data.get('agreeTerms', 'false')),
            agreeCreditCheck=json.loads(data.get('agreeCreditCheck', 'false')),
            agreeDataSharing=json.loads(data.get('agreeDataSharing', 'false')),
            translatorName=data.get('translatorName'),
            translatorPlace=data.get('translatorPlace'),
            LoanRegDate=data.get('LoanRegDate'),
            remarks=data.get('remarks'),
            startDate=data.get('startDate'),
        )

        for i, nominee_data in enumerate(json.loads(data.get('nominees', '[]'))):
            Nominee.objects.create(
                loan_application=loan,
                name=nominee_data.get('name'),
                phone=nominee_data.get('phone'),
                email=nominee_data.get('email'),
                relationship=nominee_data.get('relationship'),
                address=nominee_data.get('address'),
                idProofType=nominee_data.get('idProofType'),
                idProofNumber=nominee_data.get('idProofNumber'),
                profile_photo=request.FILES.get(f'nominee_{i}_profile_photo'),
                id_proof_file=request.FILES.get(f'nominee_{i}_id_proof')
            )

        for emi in json.loads(data.get('emiSchedule', '[]')):
            EMISchedule.objects.create(
                loan_application=loan,
                month=emi.get('month'),
                emiStartDate=emi.get('emiStartDate'),
                emiTotalMonth=emi.get('emiTotalMonth'),
                interest=emi.get('interest'),
                principalPaid=emi.get('principalPaid'),
                remainingBalance=emi.get('remainingBalance'),
                paymentAmount=emi.get('paymentAmount', 0),
                pendingAmount=emi.get('pendingAmount', 0)
            )

        return loan

def update(self, instance, validated_data):
    request = self.context.get('request')
    data = request.data

    # Remove nested relations before setting attributes
    validated_data.pop('emiSchedule', None)
    validated_data.pop('nominees', None)

    # Now safely update other fields
    for attr, value in validated_data.items():
        setattr(instance, attr, value)
    instance.save()

    # Update EMI Schedule entries manually
    if 'emiSchedule' in data:
        try:
            emi_list = json.loads(data.get('emiSchedule', '[]'))
        except Exception:
            emi_list = data.get('emiSchedule', [])

        for emi in emi_list:
            emi_id = emi.get('id')
            if emi_id:
                try:
                    emi_instance = EMISchedule.objects.get(id=emi_id, loan_application=instance)
                    emi_instance.paymentAmount = emi.get('paymentAmount', emi_instance.paymentAmount)
                    emi_instance.pendingAmount = emi.get('pendingAmount', emi_instance.pendingAmount)
                    emi_instance.save()
                except EMISchedule.DoesNotExist:
                    continue

    return instance

=======
from rest_framework import serializers
from .models import LoanApplication, Nominee, EMISchedule

class NomineeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nominee
        fields = '__all__'
        read_only_fields = ('loan_application',)

class EMIScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EMISchedule
        fields = '__all__'
        read_only_fields = ('loan_application',)

class LoanApplicationSerializer(serializers.ModelSerializer):
    nominees = NomineeSerializer(many=True, required=False)
    emiSchedule = EMIScheduleSerializer(many=True, required=False)
    applicant_photo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = LoanApplication
        fields = '__all__'

    def create(self, validated_data):
        nominees_data = validated_data.pop('nominees', [])
        emi_schedule_data = validated_data.pop('emiSchedule', [])
        
        loan_application = LoanApplication.objects.create(**validated_data)
        
        for nominee_data in nominees_data:
            Nominee.objects.create(loan_application=loan_application, **nominee_data)
            
        for emi_data in emi_schedule_data:
            EMISchedule.objects.create(loan_application=loan_application, **emi_data)
            
        return loan_application

    def update(self, instance, validated_data):
        nominees_data = validated_data.pop('nominees', None)
        emi_schedule_data = validated_data.pop('emiSchedule', None)
        
        # Update LoanApplication fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Handle nominees update
        if nominees_data is not None:
            instance.nominees.all().delete()
            for nominee_data in nominees_data:
                Nominee.objects.create(loan_application=instance, **nominee_data)
                
        # Handle EMI schedule update
        if emi_schedule_data is not None:
            instance.emiSchedule.all().delete()
            for emi_data in emi_schedule_data:
                EMISchedule.objects.create(loan_application=instance, **emi_data)
                
        return instance
>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4:backend/spkproject/loanapp/serializers.py
