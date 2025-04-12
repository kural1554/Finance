import uuid
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
def generate_userID():
    """ Generates a unique applicant ID """
    return f"AP{uuid.uuid4().hex[:6].upper()}"

class Applicant(models.Model):
    """ Stores personal details of loan applicants. """
    TITLE_CHOICES = [
        (1, 'Mr.'),
        (2, 'Mrs.'),
        (3, 'Ms.'),
        (4, 'Dr.')
    ]
    GENDER_CHOICES = [
        (1, 'Male'),
        (2, 'Female'),
        (3, 'Other')
    ]
    MARITAL_STATUS_CHOICES = [
        (1, 'Single'),
        (2, 'Married'),
        (3, 'Divorced'),
        (4, 'Widowed')
    ]

    userID = models.CharField(
        max_length=10, 
        unique=True, 
        editable=False, 
        default=generate_userID
    )
    title = models.IntegerField(choices=TITLE_CHOICES)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    gender = models.IntegerField(choices=GENDER_CHOICES)
    marital_status = models.IntegerField(choices=MARITAL_STATUS_CHOICES)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, unique=True)
    address = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.userID} - {self.first_name} {self.last_name}"

class EmploymentDetails(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [
        ('salaried', 'Salaried'),
        ('self_employed', 'Self Employed'),
        ('freelancer', 'Freelancer'),
        ('unemployed', 'Unemployed')
    ]

    applicant = models.OneToOneField(
        Applicant, 
        on_delete=models.CASCADE,
        related_name='employment_details'
    )
    employment_type = models.CharField(
        max_length=20,
        choices=EMPLOYMENT_TYPE_CHOICES
    )
    job_title = models.CharField(max_length=100)
    years_with_employer = models.PositiveIntegerField(
        validators=[MinValueValidator(0)]
    )
    monthly_income = models.DecimalField(
    max_digits=12,
    decimal_places=2,
    validators=[MinValueValidator(Decimal('0'))]  # Use Decimal instead
)
    other_income = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )

    def __str__(self):
        return f"{self.applicant.userID} - Employment Details"

class BankingDetails(models.Model):
    ACCOUNT_TYPE_CHOICES = [
        (1, 'Savings'),
        (2, 'Current'),
        (3, 'Salary'),
        (4, 'Fixed Deposit')
    ]

    applicant = models.OneToOneField(
        Applicant,
        on_delete=models.CASCADE,
        related_name='banking_details'
    )
    account_holder_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=20, unique=True)
    bank_name = models.CharField(max_length=100)
    ifsc_code = models.CharField(max_length=20)
    bank_branch = models.CharField(max_length=100)
    account_type = models.IntegerField(choices=ACCOUNT_TYPE_CHOICES)

    def __str__(self):
        return f"{self.applicant.userID} - {self.bank_name}"

class PropertyDetails(models.Model):
    PROPERTY_TYPE_CHOICES = [
        ('land', 'Land'),
        ('house', 'House'),
        ('apartment', 'Apartment'),
        ('commercial', 'Commercial Property')
    ]
    PROPERTY_OWNERSHIP_CHOICES = [
        (1, 'Owned'),
        (2, 'Mortgaged')
    ]

    applicant = models.ForeignKey(
        Applicant,
        on_delete=models.CASCADE,
        related_name='properties'
    )
    property_type = models.CharField(
        max_length=20,
        choices=PROPERTY_TYPE_CHOICES
    )
    property_address = models.TextField()
    property_value = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    property_age = models.PositiveIntegerField(
        validators=[MinValueValidator(0)]
    )
    property_ownership = models.IntegerField(
        choices=PROPERTY_OWNERSHIP_CHOICES
    )

    def __str__(self):
        return f"{self.applicant.userID} - {self.property_type}"