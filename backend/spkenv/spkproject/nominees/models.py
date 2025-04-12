from django.db import models
from django.core.validators import RegexValidator
from applicants.models import Applicant

class Nominee(models.Model):
    RELATIONSHIP_CHOICES = [
        (1, "Parent"),
        (2, "Spouse"),
        (3, "Sibling"),
        (4, "Child"),
        (5, "Other"),
    ]

    ID_PROOF_CHOICES = [
        (1, "Passport"),
        (2, "Aadhar Card"),
        (3, "Driving License"),
        (4, "Voter ID"),
        (5, "Other"),
    ]

    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE, related_name="nominees")
    nominee_name = models.CharField(max_length=100)
    nominee_email = models.EmailField(blank=True, null=True)  # Made optional
    nominee_address = models.TextField()

    nominee_phone = models.CharField(
        max_length=15,
        validators=[RegexValidator(regex=r'^\+?\d{10,15}$', message="Enter a valid phone number.")],
    )

    nominee_relationship = models.IntegerField(choices=RELATIONSHIP_CHOICES)
    nominee_id_proof_type = models.IntegerField(choices=ID_PROOF_CHOICES)
    nominee_id_proof_number = models.CharField(max_length=50)
    nominee_id_proof_file = models.FileField(upload_to="uploads/files/nomineeproof",null=True, blank=True)
    nominee_photo = models.ImageField(upload_to="uploads/images/nominee/", null=True, blank=True)

    def __str__(self):
        return f"Nominee - {self.nominee_name}"
