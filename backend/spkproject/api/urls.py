from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from applicants.views import validate_applicant_view, user_profile_view 
urlpatterns = [
    path('applicants/', include('applicants.urls')),  
    path('employees/', include('employees.urls')),
    path('cashflow/', include('cashflow.urls')),
    path('property-details/', include('property_management.urls')),
    path('combined/', include('comment.urls')),
    path('loanform/', include('finance_app.urls')),
    path('loan-applications/', include('loanapp.urls')),
    path('loanrequest/',include('loanrequest.urls')),
    path('user/profile/', user_profile_view, name='user-profile'),
    path('applicants/validate-applicant/', validate_applicant_view, name='validate-applicant'),
    
     # --- Add JWT Authentication URLs ---
   
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)