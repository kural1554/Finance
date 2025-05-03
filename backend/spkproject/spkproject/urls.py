<<<<<<< HEAD
<<<<<<< HEAD:backend/spkenv/spkproject/spkproject/urls.py
=======
<<<<<<<< HEAD:backend/spkenv/spkproject/spkproject/urls.py
>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from. import views  
from django.conf.urls.static import static
from .views import index
from django.conf import settings
urlpatterns = [
  
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), 
    # re_path(r"^.*$", views.index, name="index"),
    # path('api/', include('finance_app.urls')),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
<<<<<<< HEAD
=======
=======
========
>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from. import views  
from .views import index
urlpatterns = [
  
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), 
    re_path(r"^.*$", views.index, name="index"),
    # path('api/', include('finance_app.urls')),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
<<<<<<< HEAD
>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4:backend/spkproject/spkproject/urls.py
=======
>>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4:backend/spkproject/spkproject/urls.py
>>>>>>> b56f4b28797c8f50b6ec46a22f57826447db9aa4
