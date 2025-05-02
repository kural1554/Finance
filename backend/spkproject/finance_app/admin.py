# finance_app/admin.py
from django.contrib import admin
from .models import Applicant  # Only import existing models

# Register your models here
admin.site.register(Applicant)