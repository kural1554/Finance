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
    # re_path(r'^(?!media/|static/|api/).*$', views.index, name='index'),
    # path('api/', include('finance_app.urls')),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
