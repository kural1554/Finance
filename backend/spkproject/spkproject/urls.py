from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from. import views  
from django.conf.urls.static import static
from .views import index
from django.conf import settings
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
  
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), 
    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Frontend will POST to this URL with refresh_token to get new access_token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    re_path(r'^(?!media/|static/|api/).*$', views.index, name='index'),
   
]
    


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)