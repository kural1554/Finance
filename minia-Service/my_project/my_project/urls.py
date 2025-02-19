
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path, re_path
from. import views  
from .views import index
urlpatterns = [
path('admin/', admin.site.urls),
# path('', views.index, name='index'),
path('api/', include('user_profile.urls')),
re_path(r"^.*$", views.index, name="index"),

     # All API routes go under /api/
]
