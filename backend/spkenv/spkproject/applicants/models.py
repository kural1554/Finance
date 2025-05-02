import uuid
from django.db import models
from django.db.models import Max
from django.db import transaction

def generate_userID():
    """ Generates a unique applicant ID """
    return f"AP{uuid.uuid4().hex[:6].upper()}"

class Applicant(models.Model):
    """ Stores personal details of loan applicants. """
    userID = models.CharField(max_length=10, unique=True, editable=False, blank=False,default=generate_userID)
    
    # Choice Options
    
    TITLE_CHOICES = [(1, 'Mr.'), (2, 'Mrs.'), (3, 'Ms.'), (4, 'Dr.')]
    GENDER_CHOICES = [(1, 'Male'), (2, 'Female')]
    MARITAL_STATUS_CHOICES = [(1, 'Single'), (2, 'Married'), (3, 'Divorced'), (4, 'Widowed')]
    
   
    loan_id = models.IntegerField(null=True, editable=False, unique=True)  # Assigned upon approval
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
    profile_photo = models.ImageField(upload_to="uploads/images/customer/", null=True, blank=True)
    is_deleted = models.BooleanField(default=False) # soft delete 
    
    is_approved = models.BooleanField(default=False)  # Loan approval status


    def __str__(self):
        return f"{self.first_name} {self.last_name} - Loan ID: {self.get_loan_id()}"

    def get_next_loan_id(self):
        """ Fetch last assigned loan_id and increment it """
        return self.loan.loan_id if hasattr(self, 'loan') else "No Loan Assigned"

   

class ApplicantProof(models.Model):
    applicant = models.ForeignKey(Applicant, related_name='ApplicantProof', on_delete=models.CASCADE)
    """ Stores multiple ID proofs for an applicant. """
    
    PROOF_TYPE_CHOICES = [
        ('pan', 'pan'),
        ('aadhar', 'aadhar'),
        ('voterId', 'voterId'),
        ('Driving License', 'Driving License'),
    ]

    
    type = models.CharField(choices=PROOF_TYPE_CHOICES)
    idNumber = models.CharField(max_length=50, unique=True)
    file = models.FileField(upload_to="uploads/files/customerproof/")

    def __str__(self):
        return f"{self.get_proof_type_display()} - {self.applicant.first_name} {self.applicant.last_name}"

class EmploymentDetails(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [(1,'Agricultural Laborers'),(2,'Private Jobs'),(3,'Daily Wage Laborers'),(4,'Cottage Industry Workers'),(5,'Dairy Workers'),(6,'Rural Shopkeepers'),(7,'Government'),(8,'Transport Operators')]
    """ Employment details of an applicant. """
    applicant = models.ForeignKey(Applicant, related_name='employment', on_delete=models.CASCADE)
    employmentType = models.IntegerField(choices=EMPLOYMENT_TYPE_CHOICES, null=True, blank=True)
    jobTitle = models.CharField(max_length=100, null=True, blank=True)
    yearsWithEmployer = models.IntegerField(null=True, blank=True)
    monthlyIncome = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    otherIncome = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.applicant.first_name} {self.applicant.last_name} - {self.job_title}"

class ActivePropertiesManager(models.Manager):
    """ Custom manager to fetch only active properties (not soft-deleted). """
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)
class BankingDetails(models.Model):
    """ Stores banking details of loan applicants. """
    ACCOUNT_TYPE_CHOICES = [
        (1, 'Savings Account'),
        (2, 'Current Account'),
        (3, 'Salary Account'),
        (4, 'Fixed Deposit Account'),
    ]

    applicant = models.ForeignKey(Applicant, related_name='banking_details', on_delete=models.CASCADE)
    accountHolderName = models.CharField(max_length=100)
    accountNumber = models.CharField(max_length=20, unique=True)
    bankName = models.CharField(max_length=100)
    ifscCode = models.CharField(max_length=20)
    bankBranch = models.CharField(max_length=100)
    accountType = models.IntegerField(choices=ACCOUNT_TYPE_CHOICES)

    def __str__(self):
        return f"{self.account_holder_name} - {self.bank_name} ({self.account_number})"

    class Meta:
        verbose_name = "Banking Detail"
        verbose_name_plural = "Banking Details"
class PropertyDetails(models.Model):
    """ Stores details about properties owned by the applicant. """
    PROPERTY_OWNERSHIP_CHOICES = [(1, 'Owned'), (2, 'Mortgaged')]
    PROPERTY_TYPE_CHOICES = [
    (1, "Agricultural Land"),
    (2, "Kutcha House (Mud/Clay)"),
    (3, "Pucca House (Cement/Brick)"),
    (4, "Farm House"),
    (5, "Cattle Shed"),
    (6, "Storage Shed/Granary"),
    (7, "Residential Plot"),
    (8, "Village Shop"),
    (9, "Joint Family House"),
    (10, "Vacant Land within Village"),
]

    applicant = models.ForeignKey(Applicant, related_name='properties', on_delete=models.CASCADE)
    propertyType = models.IntegerField(choices=PROPERTY_TYPE_CHOICES, null=True, blank=True)
    property_address = models.TextField(null=True, blank=True)
    propertyValue = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    propertyAge = models.IntegerField(null=True, blank=True)  # Allow null instead of default=0
    propertyOwnership = models.IntegerField(choices=PROPERTY_OWNERSHIP_CHOICES, default=1)

    is_deleted = models.BooleanField(default=False)  # Soft delete option
    remarks = models.TextField(null=True, blank=True)

    

    # Managers
    objects = ActivePropertiesManager()  # Fetch only non-deleted records
    all_objects = models.Manager()  # Fetch all records (including soft deleted)

    def delete(self, *args, **kwargs):
        """ Soft delete instead of permanent deletion """
        self.is_deleted = True
        self.save(update_fields=['is_deleted'])

    def restore(self):
        """ Restore a soft-deleted record """
        self.is_deleted = False
        self.save(update_fields=['is_deleted'])

    def __str__(self):
        return f"{self.property_type} - LoanID: {self.applicant.loan_id}"