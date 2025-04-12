from rest_framework import serializers
from .models import Cashflow

class CashflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cashflow
        fields = ['id', 'date', 'income_amount', 'outgoing_amount', 'is_deleted']
        read_only_fields = ['is_deleted']  # Prevent users from manually modifying this field
