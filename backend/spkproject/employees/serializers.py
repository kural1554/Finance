

from rest_framework import serializers
from django.contrib.auth.models import User, Group
from django.db import transaction, IntegrityError
from .models import EmployeeDetails, EmployeeIDProof # Ensure EmployeeIDProof is imported
import logging
from django.utils import timezone # For leaving_date logic if moved here

logger = logging.getLogger(__name__)

class UserEmployeeCreateSerializer(serializers.ModelSerializer):
    # Fields for Django User model
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    last_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    role_group_name = serializers.ChoiceField(choices=['Admin', 'Manager', 'Staff'], write_only=True, required=True)

    # --- Fields for EmployeeDetails (Profile) ---
    title_choice = serializers.IntegerField(required=False, allow_null=True, write_only=True)
    
    gender_choice = serializers.IntegerField(required=False, allow_null=True, write_only=True)
    address_line1 = serializers.CharField(required=False, allow_blank=True, write_only=True)
   
    city_district = serializers.CharField(required=False, allow_blank=True, write_only=True)
    state_province = serializers.CharField(required=False, allow_blank=True, write_only=True)
    country = serializers.CharField(required=False, allow_blank=True, write_only=True)
    postal_code = serializers.CharField(required=False, allow_blank=True, write_only=True)
    phone_number = serializers.CharField(required=False, allow_blank=True, write_only=True)
    date_of_birth_detail = serializers.DateField(required=False, allow_null=True, write_only=True)
    employee_photo = serializers.ImageField(required=False, allow_null=True, write_only=True)
    joining_date = serializers.DateField(required=False, allow_null=True, write_only=True)

    
    class Meta:
        model = User
        fields = [
            'username', 'password', 'email', 'first_name', 'last_name',
            'role_group_name',
            'title_choice',  'gender_choice',
            'address_line1',  'city_district', 'state_province', 'country', 'postal_code',
            'phone_number', 'date_of_birth_detail', 'employee_photo',
            'joining_date'
        ]
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False}
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email is required.")
        # For create, check if email exists at all. For update, exclude self.
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def create(self, validated_data):
        logger.debug(f"UserEmployeeCreateSerializer CREATE - Validated Data: {validated_data}")
        role_group_name = validated_data.pop('role_group_name')
        
        # Fields to be passed to EmployeeDetails model instance
        profile_field_keys = [
            'title_choice',  'gender_choice',
            'address_line1',  'city_district', 'state_province', 'country', 'postal_code',
            'phone_number', 'date_of_birth_detail', 'joining_date'
        ]
        profile_data_for_model = {}
        for key in profile_field_keys:
            if key in validated_data:
                profile_data_for_model[key] = validated_data.pop(key)

        photo_file_to_assign = validated_data.pop('employee_photo', None)
        
        # The remaining validated_data is for the User model
        logger.debug(f"Data for User.create_user: {validated_data}")
        logger.debug(f"Data for EmployeeDetails model: {profile_data_for_model}")
        logger.debug(f"Employee photo to assign: {photo_file_to_assign.name if photo_file_to_assign else 'None'}")

        # Transaction is handled in the ViewSet to encompass document creation as well
        user = User.objects.create_user(**validated_data)

        try:
            group = Group.objects.get(name=role_group_name)
            user.groups.add(group)
            logger.info(f"User '{user.username}' added to group '{role_group_name}'.")
            if role_group_name == 'Admin' and not user.is_staff: # Ensure Admin is also staff
                user.is_staff = True
                user.save(update_fields=['is_staff'])
                logger.info(f"User '{user.username}' (Admin) set as is_staff=True.")
        except Group.DoesNotExist:
            logger.error(f"Group '{role_group_name}' does not exist for user '{user.username}'.")
            if role_group_name == 'Admin':
                 logger.critical(f"CRITICAL: Attempted to create Admin user but 'Admin' group is missing!")
            # Fallback or raise error - current code might assign to Staff if Admin group missing
            try:
                default_group, _ = Group.objects.get_or_create(name='Staff')
                user.groups.add(default_group)
                logger.warning(f"User '{user.username}' assigned to fallback 'Staff' group.")
            except Exception as group_err:
                logger.error(f"Could not assign default group to {user.username}: {group_err}")

       
        if hasattr(user, 'employee_details_profile'):
            profile_instance = user.employee_details_profile
            for attr, value in profile_data_for_model.items():
                setattr(profile_instance, attr, value)
            
            if photo_file_to_assign:
                profile_instance.employee_photo = photo_file_to_assign
            
            if profile_data_for_model or photo_file_to_assign:
                profile_instance.save() 
                logger.info(f"EmployeeDetails profile for '{user.username}' updated with provided data.")
        else:
             
             logger.error(f"EmployeeDetails profile NOT found for user {user.username} immediately after User creation and signal.")
             
        return user


class EmployeeIDProofSerializer(serializers.ModelSerializer):
    document_file_url = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeIDProof
        fields = [
            'id',
            'employee_profile', # Usually read_only or write_only on creation
            'document_type',
            'document_number',
            'document_file', # This will be the path relative to MEDIA_ROOT
            'document_file_url', # This will be the full absolute URL
            'uploaded_at'
        ]
        
        read_only_fields = ('id', 'uploaded_at', 'document_file_url')
       
    def get_document_file_url(self, obj):
        request = self.context.get('request')
        if obj.document_file and hasattr(obj.document_file, 'url') and request:
            try:
                return request.build_absolute_uri(obj.document_file.url)
            except Exception as e:
                logger.error(f"Error building absolute URI for document file {obj.document_file.name}: {e}")
                return None
        return None

class EmployeeDetailsViewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', required=False)
    first_name = serializers.CharField(source='user.first_name', read_only=True) # Made read-only
    last_name = serializers.CharField(source='user.last_name', required=False, allow_blank=True, allow_null=True)
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)
    groups = serializers.SerializerMethodField()
    role = serializers.CharField(read_only=True)

    employee_photo = serializers.ImageField(required=False, allow_null=True) # For updating profile photo
    joining_date = serializers.DateField(required=False, allow_null=True)
    leaving_date = serializers.DateField(required=False, allow_null=True)

    # --- UNCOMMENT AND USE THIS FOR DISPLAYING EXISTING DOCUMENTS ---
    id_proofs = EmployeeIDProofSerializer(many=True, read_only=True) # 'id_proofs' is the related_name

    is_currently_employed = serializers.BooleanField(read_only=True)

    class Meta:
        model = EmployeeDetails
        fields = [
            'id', 'user', 'username', 'email', 'first_name', 'last_name',
            'title_choice', 'gender_choice',
            'address_line1', 'city_district', 'state_province', 'country', 'postal_code', # Added address_line2
            'phone_number', 'date_of_birth_detail', 'employee_photo',
            'joining_date', 'leaving_date',
            'is_active', 'groups', 'role', 'employee_id', 'is_currently_employed',
            'is_deleted', 'deleted_at', 'created_at', 'updated_at',
            'id_proofs' # <<< ADDED TO FIELDS
        ]
        read_only_fields = (
            'id', 'user', 'username', 'employee_id', 'first_name',
            'created_at', 'updated_at',
            'groups', 'role', 'is_currently_employed',
            'is_active',
            'is_deleted', 'deleted_at',
           
        )

    def get_groups(self, obj):
        if obj.user: return list(obj.user.groups.values_list('name', flat=True))
        return []

    def update(self, instance, validated_data):
        # instance is EmployeeDetails instance
        user = instance.user
        request = self.context['request'] # Get request from context

        logger.debug(f"--- EmployeeDetailsViewSerializer UPDATE ---")
        logger.debug(f"Initial validated_data: {validated_data}")
        logger.debug(f"Request.data (raw form data): {request.data}")
        logger.debug(f"Request.FILES: {request.FILES}")

        # --- Transaction for all updates ---
        with transaction.atomic():
            # 1. Handle User Fields (email, last_name)
            user_data_changed = False
            user_update_fields_list = []
            user_fields_to_pop = ['email', 'last_name'] # first_name is read-only

            for key in user_fields_to_pop:
                if key in validated_data: # Check if present in validated_data from PATCH
                    value = validated_data.pop(key)
                    if getattr(user, key) != value:
                        if key == 'email' and User.objects.filter(email=value).exclude(pk=user.pk).exists():
                            raise serializers.ValidationError({'email': 'This email is already used by another user.'})
                        setattr(user, key, value)
                        user_data_changed = True
                        user_update_fields_list.append(key)
            if user_data_changed:
                user.save(update_fields=user_update_fields_list)
                logger.info(f"Updated User fields for {user.username}: {user_update_fields_list}")

            # 2. Handle EmployeeDetails direct fields (including profile photo)
            employee_details_changed = False
            employee_details_update_fields_list = []
            
            # Handle employee_photo separately if it was sent
            if 'employee_photo' in validated_data:
                new_photo = validated_data.pop('employee_photo')
                if new_photo is None or new_photo == '': # Client wants to clear the photo
                    if instance.employee_photo:
                        instance.employee_photo.delete(save=False) # Delete old file
                    instance.employee_photo = None
                else: # New file uploaded
                    if instance.employee_photo: # Delete old file if exists
                        instance.employee_photo.delete(save=False)
                    instance.employee_photo = new_photo
                employee_details_changed = True
                employee_details_update_fields_list.append('employee_photo')

            # Update other EmployeeDetails fields from validated_data
            for attr, value in validated_data.items():
                # Ensure attribute exists on the instance and is not a relation handled elsewhere
                if hasattr(instance, attr) and attr not in ['user', 'id_proofs']:
                    if getattr(instance, attr) != value:
                        setattr(instance, attr, value)
                        employee_details_changed = True
                        if attr not in employee_details_update_fields_list: # Avoid duplicates if photo was already added
                            employee_details_update_fields_list.append(attr)
            
            if employee_details_changed:
                if employee_details_update_fields_list:
                    instance.save(update_fields=employee_details_update_fields_list)
                else: # This case might happen if only photo was changed and list is empty
                    instance.save() # Save the instance if only photo changed without other fields
                logger.info(f"Updated EmployeeDetails fields for {user.username}: {employee_details_update_fields_list or 'photo only'}")


            # 3. Handle Deletion of Existing ID Proofs
            ids_to_delete_str = request.data.getlist('delete_document_ids[]')
            if not ids_to_delete_str: # Fallback for some FormData parsers
                ids_to_delete_str = [v for k, v_list in request.data.lists() for v in v_list if k == 'delete_document_ids[]']

            document_ids_to_delete = [int(id_str) for id_str in ids_to_delete_str if id_str.isdigit()]

            if document_ids_to_delete:
                deleted_count, _ = EmployeeIDProof.objects.filter(
                    employee_profile=instance, 
                    id__in=document_ids_to_delete
                ).delete()
                logger.info(f"Deleted {deleted_count} existing ID proof documents for employee {instance.id}.")

            # 4. Handle Creation of New ID Proofs
            new_documents_to_create = []
            index = 0
            while True:
                doc_type_key = f'new_id_proofs[{index}][type]'
                doc_id_number_key = f'new_id_proofs[{index}][idNumber]'
                doc_file_key = f'new_id_proofs[{index}][file]'

                doc_type = request.data.get(doc_type_key)
                doc_id_number = request.data.get(doc_id_number_key)
                doc_file = request.FILES.get(doc_file_key)

                if doc_type and doc_id_number and doc_file:
                    new_documents_to_create.append(
                        EmployeeIDProof(
                            employee_profile=instance,
                            document_type=doc_type,
                            document_number=doc_id_number,
                            document_file=doc_file
                        )
                    )
                    index += 1
                else:
                    break 
            
            if new_documents_to_create:
                EmployeeIDProof.objects.bulk_create(new_documents_to_create)
                logger.info(f"Created {len(new_documents_to_create)} new ID proof documents for employee {instance.id}.")

            # 5. Handle leaving_date logic and user active status
            old_leaving_date = getattr(EmployeeDetails.objects.get(pk=instance.pk), 'leaving_date', None) # Get current DB value
            new_leaving_date = validated_data.get('leaving_date', instance.leaving_date) # Get from validated or current instance

            if new_leaving_date != old_leaving_date: # If leaving_date changed or set/cleared
                if new_leaving_date is not None: # Leaving date is set or changed
                    if hasattr(instance, 'soft_delete_profile') and not instance.is_deleted:
                        instance.is_deleted = True # Mark for soft_delete to correctly set leaving_date
                        instance.leaving_date = new_leaving_date # Ensure this specific date is used
                        instance.soft_delete_profile() # This will also set user.is_active = False
                        logger.info(f"Employee {user.username} marked as left on {new_leaving_date}.")
                elif new_leaving_date is None and old_leaving_date is not None: # Leaving date cleared
                    if hasattr(instance, 'restore_profile') and (instance.is_deleted or not instance.user.is_active):
                        instance.restore_profile() # This will also set user.is_active = True
                        logger.info(f"Employee {user.username} restored, leaving date cleared.")

        instance.refresh_from_db() # Important to get the latest state, including related documents
        return instance