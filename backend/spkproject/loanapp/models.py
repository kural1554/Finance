
from django.db import models,connection
# from django.utils import timezone # Consider for date/time fields if default values are needed



class LoanApplication(models.Model):
    # loanID is good, using default for generation is also good.
    loanID = models.CharField(max_length=10, unique=True, blank=True ,null=True, editable=False)
    
    applicant_record = models.ForeignKey(
        'applicants.Applicant',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        to_field='userID',
        related_name='loan_applications'
    )
    first_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15) 
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    term = models.IntegerField()
    termType = models.CharField(max_length=10) # Consider choices if there's a fixed set (e.g., 'Months', 'Years')
    interestRate = models.FloatField() # For financial data, DecimalField is often preferred for precision over FloatField
    purpose = models.CharField(max_length=100)
    repaymentSource = models.CharField(max_length=100)
    
    # Boolean fields
    agreeTerms = models.BooleanField(default=False)
    agreeCreditCheck = models.BooleanField(default=False)
    agreeDataSharing = models.BooleanField(default=False)
    
    translatorName = models.CharField(max_length=100, blank=True, null=True) # Often translators are optional
    translatorPlace = models.CharField(max_length=100, blank=True, null=True) # Often translators are optional
    
    LoanRegDate = models.DateField(auto_now_add=True) 
    remarks = models.TextField(blank=True, null=True)
    startDate = models.DateField(null=True, blank=True) # When the loan actually starts

    LOAN_STATUS_CHOICES = [
        ('PENDING', 'Pending Approval'),
        ('MANAGER_APPROVED', 'Manager Approved (Awaiting Admin)'),
        ('INFO_REQUESTED', 'Information Requested'), 
        ('APPROVED', 'Approved (Final)'),
        ('ACTIVE', 'Active / Ongoing'),
        ('PAID', 'Paid / Closed'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled by Applicant'), # Thevaippatta
        ('OVERDUE', 'Overdue'),
    ]
    status = models.CharField(
        max_length=30,
        choices=LOAN_STATUS_CHOICES,
        default='PENDING'
    )
    manager_remarks = models.TextField(blank=True, null=True)
    admin_remarks = models.TextField(blank=True, null=True)
     # -- Loan ID Generation Function (Helper) --
    def _generate_loan_id(self):
        """Generates a unique SPK loan ID if one doesn't exist."""
        if not self.loanID: # loanID illaati mattum generate pannu
            prefix = "SPK"
            
            last_loan = LoanApplication.objects.filter(loanID__startswith=prefix).order_by('loanID').last()
            next_number = 1
            if last_loan and last_loan.loanID:
                try:
                    
                    numeric_part_str = last_loan.loanID[len(prefix):]
                    if numeric_part_str.isdigit():
                        next_number = int(numeric_part_str) + 1
                except ValueError:
                   
                    pass 
            
            if next_number < 1000:
                self.loanID = f"{prefix}{str(next_number).zfill(3)}"
            else:
                self.loanID = f"{prefix}{next_number}"
            
            while LoanApplication.objects.filter(loanID=self.loanID).exclude(pk=self.pk).exists():
                next_number += 1
                if next_number < 1000:
                    self.loanID = f"{prefix}{str(next_number).zfill(3)}"
                else:
                    self.loanID = f"{prefix}{next_number}"

    
    def save(self, *args, **kwargs):
        
        is_newly_approved_or_activated = False
        if self.pk: # Object already exists in DB
            try:
                old_instance = LoanApplication.objects.get(pk=self.pk)
                if old_instance.status not in ['APPROVED', 'ACTIVE'] and self.status in ['APPROVED', 'ACTIVE']:
                    is_newly_approved_or_activated = True
            except LoanApplication.DoesNotExist:
                pass # Should not happen if self.pk exists

        
        if (not self.pk and self.status in ['APPROVED', 'ACTIVE'] and not self.loanID) or \
           (is_newly_approved_or_activated and not self.loanID):
            self._generate_loan_id()

        super().save(*args, **kwargs) # Call the "real" save() method.

    def __str__(self):
        applicant_display = f" (Applicant: {self.applicant_record.userID})" if self.applicant_record else ""
        status_display = f" [Status: {self.get_status_display()}]"
        return f"{self.loanID or 'No Loan ID'}{applicant_display}{status_display}"

class Nominee(models.Model):
    loan_application = models.ForeignKey(LoanApplication, related_name='nominees', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15) # Consider validators
    email = models.EmailField(blank=True, null=True) # Nominee email might be optional
    relationship = models.CharField(max_length=100)
    address = models.TextField()
    idProofType = models.CharField(max_length=100)
    idProofNumber = models.CharField(max_length=100)
   
    profile_photo = models.ImageField(upload_to='uploads/images/nominee/', blank=True, null=True) # Photos can be optional
    id_proof_file = models.FileField(upload_to='uploads/images/nominee/idprooffile/', blank=True, null=True) # ID proofs can be optional

   
    def __str__(self):
        return self.name

class EMISchedule(models.Model):
    loan_application = models.ForeignKey(LoanApplication, related_name='emiSchedule', on_delete=models.CASCADE)
    month = models.IntegerField() # Or DateField for the specific month/year
    emiStartDate = models.DateField()
    emiTotalMonth = models.IntegerField() 
    interest = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    principalPaid = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    remainingBalance = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    
    # Payment fields
    paymentAmount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    pendingAmount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0) 
    def __str__(self):
        return f"EMI {self.month} for {self.loan_application.loanID}" 