from django.urls import include, path

from . import views

urlpatterns = [
    path('', views.index, name='products-index'),
    path('getpizza/', views.get_pizza, name='get-pizza')
]