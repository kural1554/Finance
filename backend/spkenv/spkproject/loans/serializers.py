from rest_framework import serializers
from .models import Loan

class LoanSerializer(serializers.ModelSerializer):
    loan_term_type_display = serializers.CharField(source="get_loan_term_type_display", read_only=True)
    loan_purpose_display = serializers.CharField(source="get_loan_purpose_display", read_only=True)

    class Meta:
        model = Loan
        fields = '__all__'

    def validate_loan_term_type(self, value):
        """Ensure loan_term_type is a valid choice."""
        if value not in dict(Loan.LOAN_TYPE).keys():
            raise serializers.ValidationError("Invalid loan term type.")
        return value

    def validate_loan_purpose(self, value):
        """Ensure loan_purpose is a valid choice."""
        if value not in dict(Loan.LOAN_PURPOSE).keys():
            raise serializers.ValidationError("Invalid loan purpose.")
        return value
