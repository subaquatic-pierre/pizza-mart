from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.conf import settings
from . import views
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name='user-index'),
    path('register/', views.register, name='register'),
    path('profile/', views.profile, name='profile'),
]

