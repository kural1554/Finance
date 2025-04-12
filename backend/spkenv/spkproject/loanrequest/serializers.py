from rest_framework import serializers
from .models import LoanRequest
class LoanRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanRequest
        fields = '__all__'