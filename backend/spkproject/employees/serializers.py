

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
     # --- NEW: Password fields ---
    password = serializers.CharField(write_only=True, required=False, allow_blank=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=False, allow_blank=True, style={'input_type': 'password'})
    
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
            'id_proofs','password', 'confirm_password'
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
    
    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password or confirm_password: # If user typed in either field
            if not password: # Password field itself is empty but confirm_password might not be
                 raise serializers.ValidationError({"password": "Password field cannot be empty if you intend to change it."})
            if password != confirm_password:
                raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs    
    def update(self, instance, validated_data):
        # instance is EmployeeDetails instance
        user_instance = instance.user 
        request = self.context['request']

        logger.debug(f"--- EmployeeDetailsViewSerializer UPDATE ---")
        logger.debug(f"Instance (EmployeeDetails): {instance}, User: {user_instance.username}") # Added log
        logger.debug(f"Initial validated_data: {validated_data}")
        # logger.debug(f"Request.data (raw form data): {request.data}") # Can be verbose
        # logger.debug(f"Request.FILES: {request.FILES}")

        with transaction.atomic():
            # 1. Handle User specific updates (email, last_name, password)
            user_model_updated = False 

            new_password = validated_data.pop('password', None)
            validated_data.pop('confirm_password', None) 

            if new_password: 
                user_instance.set_password(new_password) # This hashes the password
                user_model_updated = True
                logger.info(f"Password for user '{user_instance.username}' was set in memory.")


            user_direct_updatable_fields = ['email', 'last_name']
            user_fields_actually_updated_on_model = []

            for field_name in user_direct_updatable_fields:
                if field_name in validated_data: 
                    new_value = validated_data.pop(field_name) 
                    if getattr(user_instance, field_name) != new_value:
                        if field_name == 'email' and User.objects.filter(email=new_value).exclude(pk=user_instance.pk).exists():
                            raise serializers.ValidationError({'email': 'This email is already used by another user.'})
                        setattr(user_instance, field_name, new_value)
                        user_fields_actually_updated_on_model.append(field_name)
                        user_model_updated = True
            
            if user_model_updated:
                # If password changed, user_instance.save() without update_fields saves everything, including the hashed_password.
                # Django's User model's save() method handles the password field correctly without needing it in update_fields.
                if new_password:
                    user_instance.save() 
                    logger.info(f"User '{user_instance.username}' saved. Password updated. Other fields updated: {user_fields_actually_updated_on_model}")
                elif user_fields_actually_updated_on_model: 
                    user_instance.save(update_fields=user_fields_actually_updated_on_model)
                    logger.info(f"User '{user_instance.username}' saved. Updated fields: {user_fields_actually_updated_on_model}")
                else: # This case might occur if only password was set and no other user fields changed
                    user_instance.save() # Ensure save is called if only password changed
                    logger.info(f"User '{user_instance.username}' saved. Only password was updated.")


            # 2. Handle EmployeeDetails direct fields
            employee_details_changed = False
            employee_details_update_fields_list = []
            
            # Handle employee_photo
            if 'employee_photo' in validated_data: # Check if 'employee_photo' key exists
                new_photo = validated_data.pop('employee_photo') # new_photo can be File, None, or ""
                
                if new_photo == "" or new_photo is None: # Clear photo
                    if instance.employee_photo:
                        logger.info(f"Clearing employee_photo for {user_instance.username}. Old file: {instance.employee_photo.name if instance.employee_photo else 'None'}")
                        instance.employee_photo.delete(save=False) # Delete old file from storage
                    instance.employee_photo = None # Set field to None
                elif new_photo: # New file uploaded (isinstance(new_photo, File) is implicitly true here by DRF)
                    logger.info(f"Updating employee_photo for {user_instance.username} with new file: {new_photo.name}")
                    if instance.employee_photo and instance.employee_photo.name: # Delete old file if exists
                        logger.info(f"Deleting old employee_photo: {instance.employee_photo.name}")
                        instance.employee_photo.delete(save=False)
                    instance.employee_photo = new_photo # Assign new file
                
                # Regardless of clear or update, mark as changed and add to update_fields
                employee_details_changed = True
                employee_details_update_fields_list.append('employee_photo')


            # Update other EmployeeDetails fields
            for attr, value in validated_data.items(): # validated_data now only contains EmployeeDetails fields
                if hasattr(instance, attr) and attr not in ['user', 'id_proofs']: # 'user' and 'id_proofs' are relations
                    if getattr(instance, attr) != value:
                        setattr(instance, attr, value)
                        employee_details_changed = True
                        if attr not in employee_details_update_fields_list:
                            employee_details_update_fields_list.append(attr)
            
            if employee_details_changed:
                if employee_details_update_fields_list: # If there are specific fields to update
                    logger.info(f"Saving EmployeeDetails for {user_instance.username} with update_fields: {employee_details_update_fields_list}")
                    instance.save(update_fields=employee_details_update_fields_list)
                else: # This might happen if only photo was changed, but list should contain 'employee_photo'
                      # Or if no actual EmployeeDetails fields changed but employee_details_changed was true (should not happen)
                    logger.info(f"Saving EmployeeDetails for {user_instance.username} (no specific update_fields, full save). This case should be reviewed.")
                    instance.save() 
                logger.info(f"Updated EmployeeDetails fields for {user_instance.username}: {employee_details_update_fields_list or 'photo only or no changes'}")


            # 3. Handle Deletion of Existing ID Proofs
            # ... (your existing ID proof deletion logic - assumed correct for now) ...
            ids_to_delete_str = request.data.getlist('delete_document_ids[]')
            if not ids_to_delete_str: 
                ids_to_delete_str = [v for k, v_list in request.data.lists() for v in v_list if k == 'delete_document_ids[]']

            document_ids_to_delete = [int(id_str) for id_str in ids_to_delete_str if id_str.isdigit()]

            if document_ids_to_delete:
                deleted_count, _ = EmployeeIDProof.objects.filter(
                    employee_profile=instance, 
                    id__in=document_ids_to_delete
                ).delete()
                logger.info(f"Deleted {deleted_count} existing ID proof documents for employee {instance.id}.")


            # 4. Handle Creation of New ID Proofs
            # ... (your existing ID proof creation logic - assumed correct for now) ...
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

            # 5. Handle leaving_date logic
            # Get the value of leaving_date *before* any potential modifications in this update method
            db_instance_before_save = EmployeeDetails.objects.get(pk=instance.pk)
            old_leaving_date = db_instance_before_save.leaving_date
            
            # new_leaving_date is the value that will be set on the instance by setattr if 'leaving_date' was in validated_data
            # or it's the instance's current value if 'leaving_date' wasn't in validated_data
            new_leaving_date = getattr(instance, 'leaving_date', None) 

            if new_leaving_date != old_leaving_date:
                logger.info(f"Leaving date changed for {user_instance.username}. Old: {old_leaving_date}, New: {new_leaving_date}")
                if new_leaving_date is not None: 
                    if hasattr(instance, 'soft_delete_profile') and not instance.is_deleted:
                        # Ensure the instance has the correct leaving_date *before* calling soft_delete
                        # This is already handled by setattr above if 'leaving_date' was in validated_data
                        instance.soft_delete_profile() 
                        logger.info(f"Employee {user_instance.username} marked as left on {instance.leaving_date} via soft_delete_profile.")
                elif new_leaving_date is None and old_leaving_date is not None: # Leaving date cleared
                    if hasattr(instance, 'restore_profile') and (instance.is_deleted or not instance.user.is_active):
                        instance.restore_profile() 
                        logger.info(f"Employee {user_instance.username} restored, leaving date cleared via restore_profile.")
            
        instance.refresh_from_db()
        return instance
