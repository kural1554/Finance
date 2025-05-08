from rest_framework import serializers
from .models import EmployeeDetails
from django.utils import timezone

class EmployeeSerializer(serializers.ModelSerializer):
    employee_photo = serializers.ImageField(required=False)  # Optional image field
    is_deleted = serializers.BooleanField(read_only=True)  # Make read-only in API
    deleted_at = serializers.DateTimeField(read_only=True)  # Make read-only in API
    status = serializers.SerializerMethodField()  # Add computed status field

    class Meta:
        model = EmployeeDetails
        fields = '__all__'
        read_only_fields = ('employeeID', 'is_deleted', 'deleted_at')  # Prevent modification

    def get_status(self, obj):
        """Compute human-readable status"""
        return "Deleted" if obj.is_deleted else "Active"

    def update(self, instance, validated_data):
        """Ensure employeeID remains unchanged while updating other fields"""
        validated_data.pop("employeeID", None)  # Remove employeeID if provided
        validated_data.pop("is_deleted", None)  # Prevent direct modification
        validated_data.pop("deleted_at", None)  # Prevent direct modification
        
        # Handle image deletion if null is passed
        if 'employee_photo' in validated_data and validated_data['employee_photo'] is None:
            instance.employee_photo.delete(save=False)
        
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        """Customize the serialized output"""
        representation = super().to_representation(instance)
        
        # Format dates if needed
        if representation.get('deleted_at'):
            representation['deleted_at'] = instance.deleted_at.strftime("%Y-%m-%d %H:%M:%S")
        
        # Remove sensitive fields if needed
        if self.context.get('hide_sensitive'):
            representation.pop('address', None)
            representation.pop('phone', None)
        
        return representation