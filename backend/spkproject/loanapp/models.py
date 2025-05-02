<<<<<<< HEAD:backend/spkenv/spkproject/loanapp/models.py
import uuid
from django.db import models

def generate_userID():
    """Generates a unique applicant ID"""
    return f"LO{uuid.uuid4().hex[:6].upper()}"

class LoanApplication(models.Model):
    loanID = models.CharField(max_length=10, unique=True, default=generate_userID, editable=False)  # Unique ID
    
    first_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    term = models.IntegerField()
    termType = models.CharField(max_length=10)
    interestRate = models.FloatField()
    purpose = models.CharField(max_length=100)
    repaymentSource = models.CharField(max_length=100)
    agreeTerms = models.BooleanField(default=False)
    agreeCreditCheck = models.BooleanField(default=False)
    agreeDataSharing = models.BooleanField(default=False)
    translatorName = models.CharField(max_length=100)
    translatorPlace = models.CharField(max_length=100)
    LoanRegDate = models.DateField()
    remarks = models.TextField(blank=True, null=True)
    startDate = models.DateField()

    def __str__(self):
        return self.applicantID

class Nominee(models.Model):
    loan_application = models.ForeignKey(LoanApplication, related_name='nominees', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    relationship = models.CharField(max_length=100)
    address = models.TextField()
    idProofType = models.CharField(max_length=100)
    idProofNumber = models.CharField(max_length=100)
    profile_photo = models.ImageField(upload_to='nominee_photos/')
    id_proof_file = models.FileField(upload_to='nominee_id_proofs/')

    def __str__(self):
        return self.name

class EMISchedule(models.Model):
    loan_application = models.ForeignKey(LoanApplication, related_name='emiSchedule', on_delete=models.CASCADE)
    month = models.IntegerField()
    emiStartDate = models.DateField()
    emiTotalMonth = models.IntegerField()
    interest = models.FloatField()
    principalPaid = models.FloatField()
    remainingBalance = models.FloatField()
    
    # New fields for payments
    paymentAmount = models.FloatField(default=0.0)
    pendingAmount = models.FloatField(default=0.0)

    def __str__(self):
        return f"EMI {self.month} for {self.loan_application.applicantID}"
=======
from django.db import models
from django.core.validators import MinValueValidator

class LoanApplication(models.Model):
    PURPOSE_CHOICES = [
        ('1', 'Personal'),
        ('2', 'Business'),
        ('3', 'Education'),
        ('4', 'Medical'),
        ('5', 'Home Improvement'),
    ]
    
    TERM_TYPE_CHOICES = [
        ('1', 'Days'),
        ('2', 'Weeks'),
        ('3', 'Months'),
        ('4', 'Years'),
    ]
    
    RELATIONSHIP_CHOICES = [
        ('1', 'Spouse'),
        ('2', 'Parent'),
        ('3', 'Sibling'),
        ('4', 'Friend'),
        ('5', 'Other'),
    ]
    
    first_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    term = models.PositiveIntegerField()
    termType = models.CharField(max_length=1, choices=TERM_TYPE_CHOICES)
    interestRate = models.DecimalField(max_digits=5, decimal_places=2)
    purpose = models.CharField(max_length=1, choices=PURPOSE_CHOICES)
    repaymentSource = models.CharField(max_length=100)
    agreeTerms = models.BooleanField(default=False)
    agreeCreditCheck = models.BooleanField(default=False)
    agreeDataSharing = models.BooleanField(default=False)
    translatorName = models.CharField(max_length=100, blank=True, null=True)
    translatorPlace = models.CharField(max_length=100, blank=True, null=True)
    LoanRegDate = models.DateField()
    remarks = models.TextField(blank=True, null=True)
    startDate = models.DateField()
    applicant_photo = models.ImageField(upload_to='applicant_photos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} - {self.amount}"

class Nominee(models.Model):
    loan_application = models.ForeignKey(LoanApplication, related_name='nominees', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    relationship = models.CharField(max_length=1, choices=LoanApplication.RELATIONSHIP_CHOICES)
    address = models.TextField()
    idProofType = models.CharField(max_length=50)
    idProofNumber = models.CharField(max_length=50)
    profile_photo = models.ImageField(upload_to='nominee_photos/', blank=True, null=True)
    id_proof_file = models.FileField(upload_to='nominee_id_proofs/', blank=True, null=True)

    def __str__(self):
        return self.name

class EMISchedule(models.Model):
    loan_application = models.ForeignKey(LoanApplication, related_name='emiSchedule', on_delete=models.CASCADE)
    month = models.PositiveIntegerField()
    emiStartDate = models.DateField()
    emiTotalMonth = models.DecimalField(max_digits=12, decimal_places=2)
    interest = models.DecimalField(max_digits=12, decimal_places=2)
    principalPaid = models.DecimalField(max_digits=12, decimal_places=2)
    remainingBalance = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"Month {self.month} - {self.loan_application.first_name}"
>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4:backend/spkproject/loanapp/models.py
