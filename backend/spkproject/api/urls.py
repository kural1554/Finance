<<<<<<< HEAD
<<<<<<< HEAD:backend/spkenv/spkproject/api/urls.py
=======
<<<<<<<< HEAD:backend/spkenv/spkproject/api/urls.py
>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
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
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
<<<<<<< HEAD
=======
=======
========
>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4
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
<<<<<<< HEAD
>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4:backend/spkproject/api/urls.py
=======
>>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4:backend/spkproject/api/urls.py
>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4
