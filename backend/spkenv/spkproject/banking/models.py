from django.db import models
from django.core.validators import RegexValidator
from applicants.models import Applicant

class BankDetails(models.Model):
    ACCOUNT_TYPE = [
        (1, 'Savings'),
        (2, 'Current'),
    ]

    applicant = models.OneToOneField(Applicant, on_delete=models.CASCADE, related_name="bank_details")
    account_holder_name = models.CharField(max_length=255, null=False, blank=False, default="Unknown")
    account_number = models.CharField(
        max_length=18,
        validators=[RegexValidator(regex=r'^\d{9,18}$', message="Account number must be between 9 to 18 digits.")],
        unique=True,
        null=False, blank=False, default="0000000000"
    )
    bank_name = models.CharField(max_length=255, null=False, blank=False,default="Unknown Bank")
    ifsc_code = models.CharField(
        max_length=11,
        validators=[RegexValidator(regex=r'^[A-Z]{4}[0-9]{7}$', message="Invalid IFSC Code format.")],
        unique=True,
        null=False, blank=False,
        default="00000000000"  # Added to prevent migration issues
    )
    bank_branch = models.CharField(max_length=255, null=False, blank=False,default="Unknown Branch")
    account_type = models.IntegerField(choices=ACCOUNT_TYPE, default=1,null=False, blank=False)

    def __str__(self):
        return f"{self.bank_name} - {self.account_number} ({self.account_holder_name})"
