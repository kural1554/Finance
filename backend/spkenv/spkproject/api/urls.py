from django.urls import path, include

urlpatterns = [
    path('applicants/', include('applicants.urls')),  # Load applicants' API routes
    path('loans/', include('loans.urls')),  # Load loans' API routes
    path('banking/', include('banking.urls')),# Load banking's API routes
    path('nominees/', include('nominees.urls')), 
    path('employees/', include('employees.urls')), 
    path('cashflow/', include('cashflow.urls')),
]
