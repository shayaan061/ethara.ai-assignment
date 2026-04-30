from django.urls import path
from .views import create_task, dashboard

urlpatterns = [
    path('tasks', create_task),
    path('dashboard', dashboard),
]