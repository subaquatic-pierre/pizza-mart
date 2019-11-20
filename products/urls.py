from django.urls import include, path

from . import views

urlpatterns = [
    path('', views.index, name='products_menu'),
    path('getpizza/', views.get_pizza, name='get_pizza'),
]