from django.db import models

class LoanRequest(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    loan_purpose = models.CharField(max_length=50)
    loan_amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(null=True)
    def __str__(self):
        return f"{self.name} - {self.loan_purpose}"

