from django.urls import path
from .views import create_task, dashboard, update_task

urlpatterns = [
    path('tasks', create_task),
    path('tasks/<int:pk>', update_task),
    path('dashboard', dashboard),
]