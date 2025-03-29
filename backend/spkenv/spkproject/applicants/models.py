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
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.IntegerField(choices=GENDER_CHOICES, null=True, blank=True)
    marital_status = models.IntegerField(choices=MARITAL_STATUS_CHOICES, null=True, blank=True)
    email = models.EmailField(max_length=35, unique=True)
    phone = models.CharField(max_length=15, unique=True)
    address = models.TextField(null=True, blank=True)
    city = models.CharField(max_length=40, null=True, blank=True)
    state = models.CharField(max_length=40, null=True, blank=True)
    postal_code = models.CharField(max_length=10, null=True, blank=True)
    applicant_photo = models.ImageField(upload_to="uploads/images/customer/", null=True, blank=True)
  
    is_approved = models.BooleanField(default=False)  # Loan approval status
    loan_count=models.IntegerField(default=0)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - Loan ID: {self.get_loan_id()}"

    def get_next_loan_id(self):
        """ Fetch last assigned loan_id and increment it """
        return self.loan.loan_id if hasattr(self, 'loan') else "No Loan Assigned"

   

class ApplicantProof(models.Model):
    """ Stores multiple ID proofs for an applicant. """
    PROOF_TYPE_CHOICES = [
        (1, 'PAN Card'),
        (2, 'Aadhar Card'),
        (3, 'Voter ID'),
    ]

    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE, related_name="proofs")
    proof_type = models.IntegerField(choices=PROOF_TYPE_CHOICES)
    proof_number = models.CharField(max_length=50, unique=True)
    proof_file = models.FileField(upload_to="uploads/files/customerproof/")

    def __str__(self):
        return f"{self.get_proof_type_display()} - {self.applicant.first_name} {self.applicant.last_name}"

class EmploymentDetails(models.Model):
    """ Employment details of an applicant. """
    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE, related_name="employment")
    employment_type = models.CharField(max_length=100, null=True, blank=True)
    job_title = models.CharField(max_length=100, null=True, blank=True)
    years_with_employer = models.IntegerField(null=True, blank=True)
    monthly_income = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    other_income = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.applicant.first_name} {self.applicant.last_name} - {self.job_title}"

class ActivePropertiesManager(models.Manager):
    """ Custom manager to fetch only active properties (not soft-deleted). """
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)

class PropertyDetails(models.Model):
    """ Stores details about properties owned by the applicant. """
    PROPERTY_OWNERSHIP_CHOICES = [(1, 'Owned'), (2, 'Mortgaged')]

    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE, related_name="properties")
    property_type = models.CharField(max_length=100, null=True, blank=True)
    property_address = models.TextField(null=True, blank=True)
    property_value = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    property_age = models.IntegerField(null=True, blank=True)  # Allow null instead of default=0
    property_ownership = models.IntegerField(choices=PROPERTY_OWNERSHIP_CHOICES, default=1)

    is_deleted = models.BooleanField(default=False)  # Soft delete option
    remarks = models.TextField(null=True, blank=True)

    # Agreements
    agree_terms = models.BooleanField(default=False)
    agree_credit_check = models.BooleanField(default=False)
    agree_data_sharing = models.BooleanField(default=False)

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
    def __str__(self):
        return f"Applicant: {self.get_loan_id()}"