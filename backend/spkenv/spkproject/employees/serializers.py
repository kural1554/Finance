from rest_framework import serializers
from .models import EmployeeDetails

class EmployeeSerializer(serializers.ModelSerializer):
    employee_photo = serializers.ImageField(required=False) 
    class Meta:
        model = EmployeeDetails
        fields = '__all__'  # Serialize all fields

    def update(self, instance, validated_data):
        """ Ensure employeeID remains unchanged while updating other fields """
        validated_data.pop("employeeID", None)  # Remove employeeID if provided in the request
        return super().update(instance, validated_data)  # Use DRF's default update method