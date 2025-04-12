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