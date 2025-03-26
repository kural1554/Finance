from django.db import models

class CashflowQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_deleted=False)

class Cashflow(models.Model):
    date = models.DateField()
    income_amount = models.DecimalField(max_digits=10, decimal_places=2)
    outgoing_amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_deleted = models.BooleanField(default=False, db_index=True)  # Index for performance

    objects = CashflowQuerySet.as_manager()

    def delete(self, *args, **kwargs):
        """Override delete method to perform a soft delete."""
        self.is_deleted = True
        self.save()

    def restore(self):
        """Restore a soft-deleted record."""
        self.is_deleted = False
        self.save()

    def __str__(self):
        return f"Cashflow {self.date} - Income: {self.income_amount}, Outgoing: {self.outgoing_amount}"

    class Meta:
        ordering = ["-date"]  # Order by latest date first
        verbose_name = "Cashflow Entry"
        verbose_name_plural = "Cashflow Entries"



