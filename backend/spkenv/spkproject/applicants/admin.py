from django.contrib import admin
from .models import Applicant, EmploymentDetails, PropertyDetails

admin.site.register(Applicant)
admin.site.register(EmploymentDetails)
admin.site.register(PropertyDetails)

# Register your models here.
