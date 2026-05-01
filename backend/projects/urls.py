from django.urls import path
from .views import create_project, update_project, list_projects

urlpatterns = [
    path('projects', create_project),
    path('projects/<int:pk>', update_project),
    path('projects/list', list_projects),
]