import json
from decimal import Decimal
from rest_framework import serializers
from .models import Applicant, ApplicantProof, EmploymentDetails, PropertyDetails, BankingDetails
from django.db import transaction, IntegrityError
import logging

logger = logging.getLogger(__name__)

# --- Child Serializers (Final Version) ---

class ApplicantProofSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
   
    idNumber = serializers.CharField(max_length=50, required=False, validators=[])
  
    file = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = ApplicantProof
        fields = ['id', 'type', 'idNumber', 'file']
        extra_kwargs = {
            'type': {'required': False}, # Requirement handled in validate
        }

    def validate(self, data):
        """Validate data for a single proof item."""
        is_create = self.instance is None
       
        effectively_creating = is_create and not data.get('id')

        # --- Type Validation ---
        proof_type = data.get('type')
        if not proof_type:
           
            if effectively_creating or 'type' in data:
                raise serializers.ValidationError({'type': 'Proof type is required.'})
        elif proof_type not in [choice[0] for choice in ApplicantProof.PROOF_TYPE_CHOICES]:
            raise serializers.ValidationError({'type': f"Invalid proof type '{proof_type}'."})

       
        id_number = data.get('idNumber')
        if not id_number:
            
            if effectively_creating or 'idNumber' in data:
                 raise serializers.ValidationError({'idNumber': 'ID number is required.'})
       

        # --- File Validation ---
        proof_file = data.get('file')
        if effectively_creating and not proof_file:
             raise serializers.ValidationError({'file': 'A file is required for new proofs.'})
        elif not effectively_creating and 'file' in data and not proof_file:
             raise serializers.ValidationError({'file': 'File cannot be set to null as it is required.'})

        return data

class EmploymentDetailsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    employmentType = serializers.IntegerField(required=False, allow_null=True)
    jobTitle = serializers.CharField(max_length=100, required=False, allow_null=True, allow_blank=True)
    yearsWithEmployer = serializers.IntegerField(required=False, allow_null=True)
    monthlyIncome = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    otherIncome = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)

    class Meta:
        model = EmploymentDetails
        fields = ['id', 'employmentType', 'jobTitle', 'yearsWithEmployer', 'monthlyIncome', 'otherIncome']

class PropertyDetailsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    propertyType = serializers.IntegerField(required=False, allow_null=True)
    property_address = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    propertyValue = serializers.DecimalField(max_digits=15, decimal_places=2, required=False, allow_null=True)
    propertyAge = serializers.IntegerField(required=False, allow_null=True)
    propertyOwnership = serializers.IntegerField(required=False, allow_null=True)
    remarks = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = PropertyDetails
        fields = ['id', 'propertyType', 'property_address', 'propertyValue', 'propertyAge', 'propertyOwnership', 'remarks']

class BankingDetailsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    
    accountNumber = serializers.CharField(max_length=20, required=False, validators=[])

    class Meta:
        model = BankingDetails
        fields = ['id', 'accountHolderName', 'accountNumber', 'bankName', 'ifscCode', 'bankBranch', 'accountType']
        
        extra_kwargs = {
            'accountHolderName': {'required': False}, 'bankName': {'required': False},
            'ifscCode': {'required': False}, 'bankBranch': {'required': False},
            'accountType': {'required': False},
        }

    def validate(self, data):
        """Validate data for a single banking detail item."""
        is_create = self.instance is None
        effectively_creating = is_create and not data.get('id')

       
        required_fields = ['accountHolderName', 'accountNumber', 'bankName', 'ifscCode', 'bankBranch', 'accountType']
        for field_name in required_fields:
            field_value = data.get(field_name)
            
            if (effectively_creating or field_name in data) and not field_value and field_value != 0: # Allow 0
                raise serializers.ValidationError({field_name: f"{field_name.replace('_', ' ').title()} is required."})

       
        account_number = data.get('accountNumber')
       
        if effectively_creating and not account_number:
            raise serializers.ValidationError({'accountNumber': 'Account Number is required.'})

        return data

# --- Parent Serializer ---

class ApplicantSerializer(serializers.ModelSerializer):
    proofs = ApplicantProofSerializer(many=True, required=False, source='ApplicantProof')
    employment = EmploymentDetailsSerializer(many=True, required=False)
    properties = PropertyDetailsSerializer(many=True, required=False)
    banking_details = BankingDetailsSerializer(many=True, required=False)
    profile_photo = serializers.ImageField(required=False, allow_null=True)

    NESTED_HANDLERS_CONFIG = {
       'proofs': {'model_related_name': 'ApplicantProof', 'child_serializer_class': ApplicantProofSerializer},
       'employment': {'model_related_name': 'employment', 'child_serializer_class': EmploymentDetailsSerializer},
       'properties': {'model_related_name': 'properties', 'child_serializer_class': PropertyDetailsSerializer},
       'banking_details': {'model_related_name': 'banking_details', 'child_serializer_class': BankingDetailsSerializer}
    }

    class Meta:
        model = Applicant
        fields = '__all__'
        extra_kwargs = {
            'userID': {'read_only': True},
            'loan_id': {'read_only': True},
            'loanreg_date': {'read_only': True},
            # Make fields related to status read_only
            'is_deleted': {'read_only': True},
            'is_approved': {'read_only': True},
        }

    def _parse_nested_data(self, data, serializer_field_name, form_base_key):
        """Helper to parse fieldName[index][nestedFieldName] from QueryDict."""
        items_list = []
        i = 0
        while True:
            prefix = f'{form_base_key}[{i}]'
            index_keys_exist = any(key.startswith(prefix + '[') for key in data.keys())
            if index_keys_exist:
                item_dict = {}
                try: child_serializer = self.fields[serializer_field_name].child
                except KeyError: break
                id_key = f'{prefix}[id]'
                if id_key in data: item_dict['id'] = data.get(id_key)
                for field_name in child_serializer.fields.keys():
                    if field_name == 'id': continue
                    form_key = f'{prefix}[{field_name}]'
                    if form_key in data:
                        field_instance = child_serializer.fields.get(field_name)
                        if isinstance(field_instance, serializers.FileField):
                            file_obj = data.get(form_key)
                            if file_obj: item_dict[field_name] = file_obj
                        else: item_dict[field_name] = data.get(form_key)
                if item_dict: items_list.append(item_dict)
                i += 1
            else: break
        return items_list

    def to_internal_value(self, data):
        """ Handle QueryDict from FormData if necessary """
        is_querydict = hasattr(data, 'getlist')
        if is_querydict:
             processed_data = {}
             nested_keys_config = {'proofs': 'proofs', 'employment': 'employment', 'banking_details': 'banking_details', 'properties': 'properties'}
             for serializer_field, form_base_key in nested_keys_config.items():
                  if serializer_field in self.fields:
                       parsed_list = self._parse_nested_data(data, serializer_field, form_base_key)
                       if parsed_list: processed_data[serializer_field] = parsed_list
             for key in data.keys():
                  if '[' not in key:
                      value = data.get(key)
                      field_instance = self.fields.get(key)
                      if isinstance(field_instance, (serializers.FileField, serializers.ImageField)):
                           if value: processed_data[key] = value
                      elif value is not None:
                           if isinstance(field_instance, serializers.BooleanField):
                               if value.lower() == 'true': processed_data[key] = True
                               elif value.lower() == 'false': processed_data[key] = False
                           else: processed_data[key] = value
             data_for_super = processed_data
        else: data_for_super = data
        try: return super().to_internal_value(data_for_super)
        except serializers.ValidationError as e: raise e
        except Exception as e: logger.error(f"Unexpected Error during super().to_internal_value: {str(e)}", exc_info=True); raise serializers.ValidationError("Error processing input data.")

    def validate(self, data):
        """ Applicant level validation """
        proofs_data_key = 'ApplicantProof'
        if self.instance is None:
            email = data.get('email')
            phone = data.get('phone')
            if email and Applicant.objects.filter(email=email).exists(): raise serializers.ValidationError({'email': 'Applicant with this email already exists.'})
            if phone and Applicant.objects.filter(phone=phone).exists(): raise serializers.ValidationError({'phone': 'Applicant with this phone number already exists.'})
            if proofs_data_key not in data or not data[proofs_data_key]: raise serializers.ValidationError({'proofs': 'At least one valid proof is required.'})
        return data

    def _handle_nested_objects(self, applicant_instance, nested_data_list, model_related_name, child_serializer_class):
        """Handles create/update/delete for nested objects, catching IntegrityError."""
        if nested_data_list is None: return
        kept_ids = set()
        try: related_manager = getattr(applicant_instance, model_related_name)
        except AttributeError: logger.error(f"Config error: Related manager '{model_related_name}' not found."); raise serializers.ValidationError(f"Internal config error: {model_related_name}")

        for item_data in nested_data_list:
            if not item_data: continue
            item_id_str = item_data.pop('id', None)
            item_id = None
            if item_id_str:
                try: item_id = int(item_id_str)
                except (ValueError, TypeError): logger.warning(f"Invalid ID '{item_id_str}' for {model_related_name}.")

            try:
                context = self.context.copy(); context['request'] = self.context.get('request')
                instance_to_update = None
                if item_id:
                    try:
                         instance_to_update = related_manager.get(id=item_id, applicant=applicant_instance)
                         serializer = child_serializer_class(instance_to_update, data=item_data, partial=True, context=context)
                    except related_manager.model.DoesNotExist: continue
                else: serializer = child_serializer_class(data=item_data, context=context)

                if serializer.is_valid(raise_exception=True):
                    try:
                         saved_item = serializer.save(applicant=applicant_instance)
                         kept_ids.add(saved_item.id)
                    except IntegrityError as e:
                         logger.error(f"Integrity error saving {model_related_name}: {e}")
                         field_name = 'detail'; error_value = 'provided value'
                         if 'idNumber' in str(e): field_name = 'idNumber'; error_value = item_data.get(field_name, error_value)
                         elif 'accountNumber' in str(e): field_name = 'accountNumber'; error_value = item_data.get(field_name, error_value)
                         raise serializers.ValidationError({field_name: f"This value '{error_value}' already exists."})
            except serializers.ValidationError as e: raise e
            except Exception as e:
                logger.error(f"Error processing nested {model_related_name} (item_id: {item_id or 'new'}): {str(e)}", exc_info=True)
                serializer_field_name = next((k for k, v in self.NESTED_HANDLERS_CONFIG.items() if v['model_related_name'] == model_related_name), model_related_name)
                raise serializers.ValidationError({serializer_field_name: f"Error processing item {item_id or 'new'}."})

        # --- Deletion Logic ---
        try:
            current_items_qs = related_manager.filter(applicant=applicant_instance)
            if hasattr(related_manager.model, 'all_objects'): current_items_qs = related_manager.model.all_objects.filter(applicant=applicant_instance)
            items_to_delete = current_items_qs.exclude(id__in=kept_ids)
            if items_to_delete.exists():
                logger.info(f"Deleting {model_related_name} IDs: {list(items_to_delete.values_list('id', flat=True))}")
                if hasattr(related_manager.model, 'is_deleted'): items_to_delete.update(is_deleted=True)
                else: items_to_delete.delete()
        except Exception as e: logger.error(f"Error during deletion for {model_related_name}: {str(e)}", exc_info=True)


    @transaction.atomic
    def create(self, validated_data):
        nested_payloads = {}
        nested_source_keys = {'proofs': 'ApplicantProof', 'employment': 'employment','banking_details': 'banking_details', 'properties': 'properties'}
        for field_name, source_key in nested_source_keys.items():
            nested_data = validated_data.pop(source_key, [])
            nested_payloads[field_name] = nested_data
        try:
            applicant = Applicant.objects.create(**validated_data)
            logger.info(f"Created Applicant ID: {applicant.id}")
        except Exception as e: raise serializers.ValidationError(f"Error creating applicant: {e}")
        for serializer_field_name, config in self.NESTED_HANDLERS_CONFIG.items():
            data_list_for_nested = nested_payloads.get(serializer_field_name)
            if data_list_for_nested: self._handle_nested_objects(applicant, data_list_for_nested, config['model_related_name'], config['child_serializer_class'])
        applicant.refresh_from_db()
        return applicant

    @transaction.atomic
    def update(self, instance, validated_data):
        nested_payloads = {}
        nested_source_keys = {'proofs': 'ApplicantProof', 'employment': 'employment', 'banking_details': 'banking_details', 'properties': 'properties'}
        for field_name, source_key in nested_source_keys.items():
            nested_data = validated_data.pop(source_key, None)
            nested_payloads[field_name] = nested_data
        if 'profile_photo' in validated_data and validated_data['profile_photo'] is None:
            if instance.profile_photo: instance.profile_photo.delete(save=False)
        try:
            instance = super().update(instance, validated_data)
            logger.info(f"Updated Applicant main fields for ID: {instance.id}")
        except Exception as e: raise serializers.ValidationError(f"Error updating applicant: {e}")
        for serializer_field_name, config in self.NESTED_HANDLERS_CONFIG.items():
            data_list_for_nested = nested_payloads.get(serializer_field_name)
            if data_list_for_nested is not None: self._handle_nested_objects(instance, data_list_for_nested, config['model_related_name'], config['child_serializer_class'])
        instance.refresh_from_db()
        return instance