from django.urls import path, include

urlpatterns = [
    path('applicants/', include('applicants.urls')),  
    path('loans/', include('loans.urls')),  
    path('banking/', include('banking.urls')),
    path('nominees/', include('nominees.urls')),
    path('employees/', include('employees.urls')),
    path('cashflow/', include('cashflow.urls')),
    path('property-details/', include('property_management.urls')),
    path('combined/', include('comment.urls')),
    path('loanform/', include('finance_app.urls')),
    path('apply-loan/', include('loanapp.urls')),
    path('loanrequest/',include('loanrequest.urls')),
]
