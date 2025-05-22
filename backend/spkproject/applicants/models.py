import uuid
from django.db import models

# --- Add this Manager ---
class ActiveApplicantsManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)
# --- End Manager ---


def generate_userID():
    """ Generates a unique applicant ID """
    return f"AP{uuid.uuid4().hex[:6].upper()}"

class Applicant(models.Model):
    """ Stores personal details of loan applicants. """
    userID = models.CharField(max_length=10, unique=True, editable=False, blank=False,default=generate_userID)

    TITLE_CHOICES = [(1, 'Mr.'), (2, 'Mrs.'), (3, 'Ms.'), (4, 'Dr.')]
    GENDER_CHOICES = [(1, 'Male'), (2, 'Female')]
    MARITAL_STATUS_CHOICES = [(1, 'Single'), (2, 'Married'), (3, 'Divorced'), (4, 'Widowed')]
    loanreg_date = models.DateField(auto_now_add=True)
    title = models.IntegerField(choices=TITLE_CHOICES, null=True, blank=True)
    first_name = models.CharField(max_length=20,blank=False)
    last_name = models.CharField(max_length=20,blank=False)
    dateOfBirth = models.DateField(null=True, blank=True)
    gender = models.IntegerField(choices=GENDER_CHOICES, null=True, blank=True)
    maritalStatus = models.IntegerField(choices=MARITAL_STATUS_CHOICES, null=True, blank=True)
    email = models.EmailField(max_length=35, unique=True)
    phone = models.CharField(max_length=15, unique=True,blank=False)
    address = models.TextField(null=True, blank=True)
    city = models.CharField(max_length=40, null=True, blank=True)
    state = models.CharField(max_length=40, null=True, blank=True)
    postalCode = models.CharField(max_length=10, null=True, blank=True)
    profile_photo = models.ImageField(upload_to="uploads/images/customer/", null=True, blank=True, verbose_name="Profile Photo")
    is_deleted = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)

     # --- Add these Managers ---
    objects = ActiveApplicantsManager() 
    all_objects = models.Manager() 
    # --- End Managers ---

    def __str__(self):
        return f"{self.first_name} {self.last_name} - UserID: {self.userID}"
    
     # --- Optional: Add helper methods ---
    def soft_delete(self):
        """Marks the applicant as deleted."""
        self.is_deleted = True
        self.save(update_fields=['is_deleted'])
       

    def restore(self):
        """Marks the applicant as not deleted."""
        self.is_deleted = False
        self.save(update_fields=['is_deleted'])
    # --- End helper methods ---

class ApplicantProof(models.Model):
    applicant = models.ForeignKey(Applicant, related_name='ApplicantProof', on_delete=models.CASCADE)
    PROOF_TYPE_CHOICES = [
        ('pan', 'pan'),
        ('aadhar', 'aadhar'),
        ('voterId', 'voterId'),
        ('drivingLicense', 'drivingLicense'),
    ]
    type = models.CharField(max_length=50, choices=PROOF_TYPE_CHOICES, blank=False, null=False) # type should not be blank
    idNumber = models.CharField(max_length=50, unique=True, blank=False, null=False) # idNumber should not be blank
    file = models.FileField(upload_to="uploads/files/customerproof/", blank=False, null=False) # file usually required

    def __str__(self):
        return f"{self.get_type_display()} - {self.idNumber} for {self.applicant.first_name}"

class EmploymentDetails(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [(1,'Agricultural Laborers'),(2,'Private Jobs'),(3,'Daily Wage Laborers'),(4,'Cottage Industry Workers'),(5,'Dairy Workers'),(6,'Rural Shopkeepers'),(7,'Government'),(8,'Transport Operators')]
    applicant = models.ForeignKey(Applicant, related_name='employment', on_delete=models.CASCADE)
    employmentType = models.IntegerField(choices=EMPLOYMENT_TYPE_CHOICES, null=True, blank=True)
    jobTitle = models.CharField(max_length=100, null=True, blank=True)
    yearsWithEmployer = models.IntegerField(null=True, blank=True)
    monthlyIncome = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    otherIncome = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.applicant.first_name} {self.applicant.last_name} - {self.jobTitle or 'N/A'}"

class ActivePropertiesManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)

class PropertyDetails(models.Model):
    PROPERTY_OWNERSHIP_CHOICES = [(1, 'Owned'), (2, 'Mortgaged')]
    PROPERTY_TYPE_CHOICES = [
        (1, "Agricultural Land"), (2, "Kutcha House (Mud/Clay)"),
        (3, "Pucca House (Cement/Brick)"), (4, "Farm House"),
        (5, "Cattle Shed"), (6, "Storage Shed/Granary"),
        (7, "Residential Plot"), (8, "Village Shop"),
        (9, "Joint Family House"), (10, "Vacant Land within Village"),
    ]
    applicant = models.ForeignKey(Applicant, related_name='properties', on_delete=models.CASCADE)
    propertyType = models.IntegerField(choices=PROPERTY_TYPE_CHOICES, null=True, blank=True)
    property_address = models.TextField(null=True, blank=True)
    propertyValue = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    propertyAge = models.IntegerField(null=True, blank=True)
    propertyOwnership = models.IntegerField(choices=PROPERTY_OWNERSHIP_CHOICES, default=1)
    is_deleted = models.BooleanField(default=False)
    remarks = models.TextField(null=True, blank=True)

    objects = ActivePropertiesManager()
    all_objects = models.Manager()

    def delete(self, using=None, keep_parents=False): # Soft delete
        self.is_deleted = True
        self.save(update_fields=['is_deleted'])

    def restore(self):
        self.is_deleted = False
        self.save(update_fields=['is_deleted'])

    def __str__(self):
        return f"{self.get_propertyType_display()} at {self.property_address or 'N/A'} for {self.applicant.first_name}"


class BankingDetails(models.Model):
    ACCOUNT_TYPE_CHOICES = [
        (1, 'Savings Account'), (2, 'Current Account'),
        (3, 'Salary Account'), (4, 'Fixed Deposit Account'),
    ]
    applicant = models.ForeignKey(Applicant, related_name='banking_details', on_delete=models.CASCADE)
    accountHolderName = models.CharField(max_length=100, blank=False)
    accountNumber = models.CharField(max_length=20, unique=True, blank=False)
    bankName = models.CharField(max_length=100, blank=False)
    ifscCode = models.CharField(max_length=20, blank=False)
    bankBranch = models.CharField(max_length=100, blank=False)
    accountType = models.IntegerField(choices=ACCOUNT_TYPE_CHOICES, blank=False)

    def __str__(self):
        return f"{self.accountHolderName} - {self.bankName} ({self.accountNumber})"

    class Meta:
        verbose_name = "Banking Detail"
        verbose_name_plural = "Banking Details"