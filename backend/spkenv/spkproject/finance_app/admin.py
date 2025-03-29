from django.contrib import admin
from .models import Loan, Employment, BankDetails  # Make sure models exist

admin.site.register(Loan)
admin.site.register(Employment)
admin.site.register(BankDetails)
