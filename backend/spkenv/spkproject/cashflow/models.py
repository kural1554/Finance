from django.db import models

class Cashflow(models.Model):
    date = models.DateField()
    income_amount = models.DecimalField(max_digits=10, decimal_places=2)
    outgoing_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Cashflow {self.date} - Income: {self.income_amount}, Outgoing: {self.outgoing_amount}"

