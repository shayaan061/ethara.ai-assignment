from django.urls import path
from .views import create_project

urlpatterns = [
    path('projects', create_project),
]