from django.urls import path
from .views import register, login, list_users, init_admin

urlpatterns = [
    path('register', register),
    path('login', login),
    path('users', list_users),
]