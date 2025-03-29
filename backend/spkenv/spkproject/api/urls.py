from django.urls import path, include

urlpatterns = [
    path('applicants/', include('applicants.urls')),  
    path('loans/', include('loans.urls')),  
    path('banking/', include('banking.urls')),
    path('nominees/', include('nominees.urls')),
    path('employees/', include('employees.urls')),
    path('cashflow/', include('cashflow.urls')),
]
