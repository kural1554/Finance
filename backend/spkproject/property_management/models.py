from django.db import models
from django.core.validators import MinValueValidator
from applicants.models import Applicant

class PropertyDetails(models.Model):
    PROPERTY_OWNERSHIP_CHOICES = [
        (1, 'Owned'),
        (2, 'Mortgaged'),
    ]

    PROPERTY_TYPE_CHOICES = [
        (1, 'Residential'),
        (2, 'Commercial'),
        (3, 'Industrial'),
        (4, 'Agricultural'),
        (5, 'Plot'),
    ]
    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE)
    # applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE, related_name="property_details")
    property_type = models.IntegerField(
        choices=PROPERTY_TYPE_CHOICES,
        null=False,
        blank=False,
        default=1
    )
    property_address = models.TextField(
        null=False,
        blank=False,
        default="Unknown Address"
    )
    property_value = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        null=False,
        blank=False,
        default=0.00
    )
    property_age = models.PositiveIntegerField(
        null=False,
        blank=False,
        default=0
    )
    property_ownership = models.IntegerField(
        choices=PROPERTY_OWNERSHIP_CHOICES,
        default=1,
        null=False,
        blank=False
    )
    is_deleted = models.BooleanField(
        default=False,
        null=False,
        blank=False
    )
    remarks = models.TextField(
        null=True,
        blank=True
    )

    def delete(self, *args, **kwargs):
        """Soft delete instead of permanent deletion"""
        self.is_deleted = True
        self.save(update_fields=['is_deleted'])

    def restore(self):
        """Restore a soft-deleted record"""
        self.is_deleted = False
        self.save(update_fields=['is_deleted'])

    def __str__(self):
        return f"{self.get_property_type_display()} - {self.get_property_ownership_display()} by {self.applicant}"