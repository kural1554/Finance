from django.db import models
from django.utils import timezone
import uuid

class EmployeeDetailsManager(models.Manager):
    """Custom manager to handle soft delete logic"""
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)
    
    def with_deleted(self):
        """Include deleted records in queryset"""
        return super().get_queryset()
    
    def only_deleted(self):
        """Get only deleted records"""
        return super().get_queryset().filter(is_deleted=True)

class EmployeeDetails(models.Model):
    EMPLOYEE_TYPE = [
        (1, 'ADMIN'),
        (2, 'MANAGER'),
        (3, 'APPLICANT'),
    ]
    TITLE_CHOICES = [
        (1, 'Mr.'),
        (2, 'Mrs.'),
        (3, 'Ms.'),
        (4, 'Dr.'),
    ]
    GENDER_CHOICES = [
        (1, 'Male'),
        (2, 'Female'),
    ]

    # Core fields
    employeeID = models.CharField(max_length=12, unique=True, editable=False)
    title = models.SmallIntegerField(choices=TITLE_CHOICES, blank=True, default=1)
    emp_type = models.SmallIntegerField(choices=EMPLOYEE_TYPE, default=1, blank=True)
    empfirst_name = models.CharField(max_length=50)
    empfather_name = models.CharField(max_length=50)
    gender = models.SmallIntegerField(choices=GENDER_CHOICES, blank=True, default=1)
    address = models.TextField(null=True, blank=True)
    email = models.EmailField(max_length=50, unique=True)
    phone = models.CharField(max_length=15)
    date_of_birth = models.DateField(null=True, blank=True)
    employee_photo = models.ImageField(upload_to="uploads/images/employee/", null=True, blank=True)
    
    # Soft delete fields
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Managers
    objects = EmployeeDetailsManager()
    all_objects = models.Manager()  # Includes deleted records

    class Meta:
        verbose_name = "Employee"
        verbose_name_plural = "Employees"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['employeeID']),
            models.Index(fields=['email']),
            models.Index(fields=['is_deleted']),
        ]

    def save(self, *args, **kwargs):
        """Generate a unique employee ID on creation"""
        if not self.employeeID:
            while True:
                new_id = f"EMP{uuid.uuid4().hex[:6].upper()}"
                if not EmployeeDetails.objects.filter(employeeID=new_id).exists():
                    self.employeeID = new_id
                    break
        super().save(*args, **kwargs)

    def soft_delete(self):
        """Mark as deleted instead of actually deleting"""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        """Restore a soft-deleted record"""
        self.is_deleted = False
        self.deleted_at = None
        self.save()

    def __str__(self):
        return f"{self.empfirst_name} ({self.get_emp_type_display()}) - {self.employeeID}"

    @property
    def full_name(self):
        """Get employee's full name with title"""
        title = self.get_title_display() if self.title else ''
        return f"{title} {self.empfirst_name} {self.empfather_name}".strip()

    @property
    def age(self):
        """Calculate employee's age based on date_of_birth"""
        if not self.date_of_birth:
            return None
        today = timezone.now().date()
        return today.year - self.date_of_birth.year - (
            (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )