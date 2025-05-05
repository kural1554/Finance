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
