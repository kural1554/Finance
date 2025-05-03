<<<<<<< HEAD
<<<<<<< HEAD:backend/spkenv/spkproject/applicants/serializers.py
=======
<<<<<<<< HEAD:backend/spkenv/spkproject/applicants/serializers.py
>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4
from rest_framework import serializers
from django.db import transaction
from .models import Applicant, EmploymentDetails, PropertyDetails, ApplicantProof, BankingDetails
import json
from django.core.exceptions import ValidationError as DjangoValidationError

class ApplicantProofSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicantProof
        exclude = ['applicant']
        extra_kwargs = {
            'id': {'read_only': False, 'required': False},
            'file': {'required': False, 'allow_null': True},
            'idNumber': {'required': True}
        }

    def validate(self, data):
        proof_type = data.get('type')
        id_number = data.get('idNumber')

        if proof_type == 'pan':
             if not id_number or len(id_number) != 10 or not id_number[:5].isalpha() or \
                not id_number[5:9].isdigit() or not id_number[-1].isalpha():
                raise serializers.ValidationError("Invalid PAN format")

        if proof_type == 'aadhar':
            if not id_number or len(id_number) != 12 or not id_number.isdigit():
                raise serializers.ValidationError("Aadhar must be 12 digits")

        return data

class EmploymentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentDetails
        exclude = ['applicant']
        extra_kwargs = {
            'id': {'read_only': False, 'required': False},
            'monthlyIncome': {'min_value': 0},
            'yearsWithEmployer': {'min_value': 0}
        }

class PropertyDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyDetails
        exclude = ['applicant']
        extra_kwargs = {
            'id': {'read_only': False, 'required': False},
            'propertyValue': {'min_value': 0},
            'propertyAge': {'min_value': 0}
        }

class BankingDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankingDetails
        exclude = ['applicant']
        extra_kwargs = {
            'id': {'read_only': False, 'required': False},
            'accountNumber': {'required': True},
            'ifscCode': {'required': True}
        }

    def validate(self, data):
        ifsc = data.get('ifscCode', '')
        if len(ifsc) != 11 or not ifsc[:4].isalpha() or not ifsc[4:].isdigit():
             # Note: The original check was ifsc[4:].isdigit(), assuming the 5th char is '0'.
             # A standard IFSC is 4 letters, '0', 6 alphanumeric. Let's refine:
            if len(ifsc) != 11 or not ifsc[:4].isalpha() or ifsc[4] != '0' or not ifsc[5:].isalnum():
                 raise serializers.ValidationError({"ifscCode": "Invalid IFSC code format (e.g., ABCD0123456)."})
        return data


class ApplicantProofSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicantProof
        exclude = ['applicant']
        extra_kwargs = {
            'id': {'read_only': False, 'required': False},
            'file': {'required': False, 'allow_null': True},
            'idNumber': {'required': True}
        }

    def validate(self, data):
        proof_type = data.get('type')
        id_number = data.get('idNumber')

        if proof_type == 'pan':
             if not id_number or len(id_number) != 10 or not id_number[:5].isalpha() or \
                not id_number[5:9].isdigit() or not id_number[-1].isalpha():
                raise serializers.ValidationError("Invalid PAN format")

        if proof_type == 'aadhar':
            if not id_number or len(id_number) != 12 or not id_number.isdigit():
                raise serializers.ValidationError("Aadhar must be 12 digits")

        return data

class EmploymentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentDetails
        exclude = ['applicant']
        extra_kwargs = {
            'id': {'read_only': False, 'required': False},
            'monthlyIncome': {'min_value': 0},
            'yearsWithEmployer': {'min_value': 0}
        }

class PropertyDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyDetails
        exclude = ['applicant']
        extra_kwargs = {
            'id': {'read_only': False, 'required': False},
            'propertyValue': {'min_value': 0},
            'propertyAge': {'min_value': 0}
        }

class BankingDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankingDetails
        exclude = ['applicant']
        extra_kwargs = {
            'id': {'read_only': False, 'required': False},
            'accountNumber': {'required': True},
            'ifscCode': {'required': True}
        }

    def validate(self, data):
        ifsc = data.get('ifscCode', '')
        # Corrected IFSC validation
        if len(ifsc) != 11 or not ifsc[:4].isalpha() or ifsc[4] != '0' or not ifsc[5:].isalnum():
             raise serializers.ValidationError({"ifscCode": "Invalid IFSC code format (e.g., ABCD0123456)."})
        return data


# --- Corrected ApplicantSerializer ---
class ApplicantSerializer(serializers.ModelSerializer):
    employment = EmploymentDetailsSerializer(many=True, required=False)
    properties = PropertyDetailsSerializer(many=True, required=False)
    banking_details = BankingDetailsSerializer(many=True, required=False)
    proofs = ApplicantProofSerializer(many=True, required=False, source='ApplicantProof')

    class Meta:
        model = Applicant
        fields = '__all__'
        read_only_fields = ('userID', 'loan_id', 'loanreg_date')

    def validate(self, data):
        if data.get('dateOfBirth') and data['dateOfBirth'].year < 1900:
             raise serializers.ValidationError({"dateOfBirth": "Invalid date of birth"})
        return data

    def to_internal_value(self, data):
        # Parse JSON strings for nested fields if needed
        for field in ['employment', 'banking_details', 'properties', 'proofs']:
            if field in data and isinstance(data[field], str):
                try:
                    data[field] = json.loads(data[field])
                except Exception:
                    pass
        return super().to_internal_value(data)

    @transaction.atomic
    def update(self, instance, validated_data):
        related_names_mapping = {
            'employment': 'employment',
            'properties': 'properties',
            'banking_details': 'banking_details',
            'ApplicantProof': 'ApplicantProof' # Corrected value
        }

        nested_updates = {}
        for field_name in related_names_mapping.keys():
            if field_name in validated_data:
                nested_updates[field_name] = validated_data.pop(field_name)

        # Update the main Applicant instance fields
        instance = super().update(instance, validated_data)

        # Process nested updates using the corrected related manager names from the mapping values
        for field_name, field_data_list in nested_updates.items():
            actual_related_name = related_names_mapping[field_name]
            self._update_nested_data(instance, actual_related_name, field_data_list)

        instance.refresh_from_db()
        return instance

    def _update_nested_data(self, instance, related_name, field_data_list):
        try:
            # Use the actual_related_name obtained from the mapping
            related_manager = getattr(instance, related_name)
        except AttributeError:
            # This error should now be avoided if the mapping is correct
            raise serializers.ValidationError(f"Internal configuration error: Related manager '{related_name}' not found.")

        existing_items_map = {item.id: item for item in related_manager.all()}

        for item_data in field_data_list:
            item_id = item_data.get('id')

            if item_id is not None and item_id in existing_items_map:
                existing_item = existing_items_map[item_id]
                updated = False
                for key, value in item_data.items():
                    # Skip 'id' and check if attribute exists
                    if key != 'id' and hasattr(existing_item, key):
                        current_value = getattr(existing_item, key)
                        # Basic comparison, consider type casting if needed (e.g., Decimal vs str)
                        if current_value != value:
                            setattr(existing_item, key, value)
                            updated = True

                if updated:
                    try:
                        # Exclude fields automatically set or managed by relations
                        existing_item.full_clean(exclude=['id', 'applicant'])
                    except DjangoValidationError as e:
                        # Propagate model validation errors
                        raise serializers.ValidationError({f"{related_name} (ID: {item_id})": e.message_dict})
                    existing_item.save()


    @transaction.atomic
    def create(self, validated_data):
        # Pop data using the correct keys (matching source/field names)
        employment_data = validated_data.pop('employment', [])
        property_data = validated_data.pop('properties', [])
        banking_data = validated_data.pop('banking_details', [])
        proofs_data = validated_data.pop('ApplicantProof', []) # Use the source name

        applicant = super().create(validated_data)

        # Create related objects
        for emp_data in employment_data:
            EmploymentDetails.objects.create(applicant=applicant, **emp_data)
        for prop_data in property_data:
            PropertyDetails.objects.create(applicant=applicant, **prop_data)
        for bank_data in banking_data:
            BankingDetails.objects.create(applicant=applicant, **bank_data)
        for proof_data in proofs_data:
            ApplicantProof.objects.create(applicant=applicant, **proof_data)

        return applicant
<<<<<<< HEAD
=======
=======
========
>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4
from rest_framework import serializers
from .models import Applicant, EmploymentDetails, PropertyDetails, ApplicantProof, BankingDetails


class ApplicantProofSerializer(serializers.ModelSerializer):
    file = serializers.FileField()  # Handles file uploads
    class Meta:
        model = ApplicantProof
        exclude = ['applicant']


class EmploymentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentDetails
        exclude = ['applicant']  # applicant will be assigned in code


class PropertyDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyDetails
        exclude = ['applicant']


class BankingDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankingDetails
        exclude = ['applicant']


class ApplicantSerializer(serializers.ModelSerializer):
    employment = EmploymentDetailsSerializer(many=True, required=False)
    properties = PropertyDetailsSerializer(many=True, required=False)
    banking_details = BankingDetailsSerializer(many=True, required=False)
    ApplicantProof= ApplicantProofSerializer(many=True, required=False)

    class Meta:
        model = Applicant
        fields = '__all__'  # Include all fields from Applicant

    def create(self, validated_data):
        employment_data = validated_data.pop('employment', [])
        property_data = validated_data.pop('properties', [])
        banking_data = validated_data.pop('banking_details', [])
        ApplicantProof_data = validated_data.pop('ApplicantProof', [])
        
        applicant = Applicant.objects.create(**validated_data)

        # Create related employment records
        for emp in employment_data:
            EmploymentDetails.objects.create(applicant=applicant, **emp)

        # Create related property records
        for prop in property_data:
            PropertyDetails.objects.create(applicant=applicant, **prop)
        
        for proof in ApplicantProof_data:
            ApplicantProof.objects.create(applicant=applicant, **proof)

        # Create related bank records
        for bank in banking_data:
            BankingDetails.objects.create(applicant=applicant, **bank)

        return applicant

    def update(self, instance, validated_data):
        employment_data = validated_data.pop('employment', None)
        property_data = validated_data.pop('properties', None)
        banking_data = validated_data.pop('banking_details', None)
        ApplicantProof_data = validated_data.pop('ApplicantProof',None)


        # Update basic fields of applicant
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update nested employment
        if employment_data is not None:
            instance.employment.all().delete()
            for emp in employment_data:
                EmploymentDetails.objects.create(applicant=instance, **emp)

        # Update nested property
        if property_data is not None:
            instance.properties.all().delete()
            for prop in property_data:
                PropertyDetails.objects.create(applicant=instance, **prop)

        # Update nested banking
        if banking_data is not None:
            instance.banking_details.all().delete()
            for bank in banking_data:
                BankingDetails.objects.create(applicant=instance, **bank)
         # Update nested banking
        if ApplicantProof_data is not None:
            instance.ApplicantProof.all().delete()
            for proof in ApplicantProof_data:
               ApplicantProof.objects.create(applicant=instance, **proof)        

        return instance
<<<<<<< HEAD
>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4:backend/spkproject/applicants/serializers.py
=======
>>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4:backend/spkproject/applicants/serializers.py
>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4
