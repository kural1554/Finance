from django.urls import path
from .views import combined_external_api  # ✅ Importing correctly

urlpatterns = [
    path("combined/", combined_external_api, name="combined_api")  # ✅ Use directly
]