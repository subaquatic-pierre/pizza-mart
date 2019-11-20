from django.urls import path

from . import views

urlpatterns = [
    path("", views.OrderList.as_view(), name='order_list'),
    path('checkout/', views.checkout, name='checkout'),
    path("place-order/", views.place_order, name="place_order"),
    path('<str:pk>/', views.order_detail, name='order_detail')
]
