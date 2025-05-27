from django.db import models
from django.contrib.auth.models import User, Group # Import User and Group
from django.utils import timezone
import uuid
from django.db.models.signals import post_save
from django.dispatch import receiver
import logging

from django.db import transaction
logger = logging.getLogger(__name__)

# --- Manager for EmployeeDetails if you need soft delete for these profiles ---
class ActiveEmployeeDetailsManager(models.Manager): # Renamed manager
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False, leaving_date__isnull=True)

class EmployeeDetails(models.Model): 
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='employee_details_profile', 
  
    )

    # --- Your existing choices ---
    TITLE_CHOICES = [(1, 'Mr.'), (2, 'Mrs.'), (3, 'Ms.'), (4, 'Dr.')]
    GENDER_CHOICES = [(1, 'Male'), (2, 'Female')]

    employee_id = models.CharField(max_length=12, unique=True, editable=False, blank=True)
    title_choice = models.SmallIntegerField(choices=TITLE_CHOICES, blank=True, null=True) 
    
    gender_choice = models.SmallIntegerField(choices=GENDER_CHOICES, blank=True, null=True)
    address_line1 = models.CharField(max_length=255, blank=True, verbose_name="Address Line 1")
    city_district = models.CharField(max_length=100, blank=True, verbose_name="City/District")
    state_province = models.CharField(max_length=100, blank=True, verbose_name="State/Province")
    country = models.CharField(max_length=100, blank=True, verbose_name="Country")
    postal_code = models.CharField(max_length=20, blank=True, verbose_name="Postal Code")
    phone_number = models.CharField(max_length=15, blank=True)
    date_of_birth_detail = models.DateField(null=True, blank=True) 
    employee_photo = models.ImageField(upload_to="uploads/images/employee_profiles/", null=True, blank=True)
    
    joining_date = models.DateField(null=True, blank=True, verbose_name="Joining Date")
    leaving_date = models.DateField(null=True, blank=True, verbose_name="Leaving Date")
   
    # --- Soft delete for EmployeeDetails (optional) ---
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Managers
    objects = models.Manager() 
    active_objects = ActiveEmployeeDetailsManager() 

    class Meta:
        verbose_name = "Employee Detail" # Singular
        verbose_name_plural = "Employee Details" # Plural
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['employee_id']),
            models.Index(fields=['user']),
            models.Index(fields=['is_deleted']),
            models.Index(fields=['joining_date']), # Added index
            models.Index(fields=['leaving_date']),
            models.Index(fields=['country', 'state_province', 'city_district']),
        ]

    def save(self, *args, **kwargs):
        is_new = not self.pk # Check if this is a new instance

        if is_new:
            # Set default joining_date to today if not provided for a new employee
            if not self.joining_date:
                self.joining_date = timezone.now().date()

            # Generate employee_id if it's not already set
            if not self.employee_id:
                with transaction.atomic():
                    current_year_yy = self.joining_date.strftime('%y') if self.joining_date else timezone.now().strftime('%y')
                    prefix_with_year = f"EMP{current_year_yy}"

                    while True:
                        last_employee_for_year = EmployeeDetails.objects.filter(
                            employee_id__startswith=prefix_with_year
                        ).order_by('employee_id').last()

                        next_sequence_num = 1
                        if last_employee_for_year:
                            try:
                                last_sequence_str = last_employee_for_year.employee_id[len(prefix_with_year):]
                                next_sequence_num = int(last_sequence_str) + 1
                            except (ValueError, IndexError) as e:
                                logger.error(
                                    f"Could not parse sequence from existing employee_id: "
                                    f"{last_employee_for_year.employee_id}. Error: {e}. Defaulting to 1 for {prefix_with_year}"
                                )
                                next_sequence_num = 1

                        new_id_suffix = f"{next_sequence_num:03d}"
                        generated_employee_id = f"{prefix_with_year}{new_id_suffix}"

                        if not EmployeeDetails.objects.filter(employee_id=generated_employee_id).exists():
                            self.employee_id = generated_employee_id
                            break
                        else:
                            logger.warning(f"Generated employee_id {generated_employee_id} already exists. Retrying.")
        
        
        super().save(*args, **kwargs)

    
    def __str__(self):
        join_date_str = self.joining_date.strftime('%Y-%m-%d') if self.joining_date else 'N/A'
        leave_date_str = self.leaving_date.strftime('%Y-%m-%d') if self.leaving_date else 'N/A'
        return (f"{self.user.get_full_name() or self.user.username} "
                f"(ID: {self.employee_id or 'N/A'}, Joined: {join_date_str}, Left: {leave_date_str})")
    # Helper properties for role checks (using Django Groups associated with self.user)
    
    @property
    def is_currently_employed(self):
        """Checks if the employee has a joining date and no leaving date."""
        return self.joining_date is not None and self.leaving_date is None
    
    @property
    def role(self):
        if not self.user_id: return 'Unknown' # Handle case where user might not be set yet
        if self.user.is_superuser or self.user.groups.filter(name='Admin').exists(): return 'Admin'
        if self.user.groups.filter(name='Manager').exists(): return 'Manager'
        if self.user.groups.filter(name='Staff').exists(): return 'Staff'
        return 'Unknown'

    @property
    def is_admin(self): return self.role == 'Admin'
    @property
    def is_manager(self): return self.role == 'Manager'
    @property
    def is_staff(self): return self.role == 'Staff'

    # Soft delete methods for EmployeeDetails (if needed)
    def soft_delete_profile(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        if not self.leaving_date: # If no explicit leaving date set, mark it as today
            self.leaving_date = timezone.now().date()

        if self.user:
                self.user.is_active = False
                self.user.save(update_fields=['is_active'])
                
        self.save(update_fields=['is_deleted', 'deleted_at', 'leaving_date'])

    def restore_profile(self):
        self.is_deleted = False
        self.deleted_at = None
        self.leaving_date = None 

        if self.user:
            self.user.is_active = True
            self.user.save(update_fields=['is_active'])
        self.save(update_fields=['is_deleted', 'deleted_at'])

# --- Signal to create EmployeeDetails when a User is created ---
@receiver(post_save, sender=User)
def create_or_update_employee_details(sender, instance, created, **kwargs):
    if created: 
        profile, profile_created = EmployeeDetails.objects.get_or_create(user=instance) # Use get_or_create to be safe
        if profile_created:
            logger.info(f"EmployeeDetails created for user: {instance.username}")
        else:
            logger.info(f"EmployeeDetails already exists for user: {instance.username}")
        
        if not instance.is_superuser:
            try:
                staff_group = Group.objects.get(name='Staff')
                instance.groups.add(staff_group)
            except Group.DoesNotExist:
                logger.warning("Default 'Staff' group not found. Please create it in Django Admin.")

class EmployeeIDProof(models.Model):
    employee_profile = models.ForeignKey(EmployeeDetails, related_name='id_proofs', on_delete=models.CASCADE)
    document_type = models.CharField(max_length=50)
    document_number = models.CharField(max_length=50)
    document_file = models.FileField(upload_to='uploads/employee_id_proofs/') # Changed path slightly
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.document_type} ({self.document_number}) for {self.employee_profile.user.username}"