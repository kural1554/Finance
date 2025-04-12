from django.db import models
from applicants.models import Applicant
from employees.models import EmployeeDetails

class Loan(models.Model):
    LOAN_TYPE = [
        (1, 'DAILY'),
        (2, 'WEEK'),
        (3, 'MONTH'),
    ]
    LOAN_PURPOSE = [
        (1, 'CHILDRENS EDUCATION'),
        (2, 'MEDICAL'),
        (3, 'BUSINESS'),
    ]

    applicant = models.OneToOneField(Applicant, on_delete=models.CASCADE)
    entered_by = models.ForeignKey(EmployeeDetails, on_delete=models.SET_NULL, null=True, blank=True, related_name="entered_loans")
    loan_amount = models.DecimalField(max_digits=10, decimal_places=2)
    loan_term = models.IntegerField()
    loan_term_type = models.IntegerField(choices=LOAN_TYPE)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    loan_purpose = models.IntegerField(choices=LOAN_PURPOSE)
    loan_purpose_other = models.TextField(blank=True, null=True)
    repayment_source = models.CharField(max_length=100)

    loan_id = models.PositiveIntegerField(unique=True, null=True, blank=True, editable=False)  # Loan ID (generated when approved)
    is_approved = models.BooleanField(default=False)  # Approval status

    def save(self, *args, **kwargs):
        """ Assign a unique loan ID only when approved """
        if self.is_approved and self.loan_id is None:
            self.loan_id = self.get_next_loan_id()
        
        super().save(*args, **kwargs)

    def get_next_loan_id(self):
        """ Fetch the last assigned loan_id and increment it """
        last_loan = Loan.objects.exclude(loan_id=None).order_by('-loan_id').first()
        if last_loan:
            return last_loan.loan_id + 1
        return 1  # First loan ID starts from 1

    def __str__(self):
        return f"Loan {self.loan_id if self.loan_id else 'Pending'} - {self.applicant}"
