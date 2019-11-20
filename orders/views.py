import json
from datetime import datetime
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from .models import Order, Item
from django.utils import timezone
from django.views.generic import ListView, DetailView
from django.contrib import messages
from django.contrib.auth.mixins import PermissionRequiredMixin
from users.forms import AddressUpdateForm


@login_required
def checkout(request):
    if request.method == 'POST':        
        res = request.POST
        cart = res.get('data')
        cart = json.loads(cart)
        context = cart
        total = 0
        for key, item in cart.items():    
            total = total + float(item['price'])
        cart['total'] = total
        context = {
            'cart': cart,
            'form': AddressUpdateForm(instance=request.user.address)
            }
        return render(request, 'orders/cart.html', context)
    else:
        return redirect('products_menu')


@login_required
def place_order(request):
    if request.method == 'POST':
        form = AddressUpdateForm(request.POST, instance=request.user.address) 
        if form.is_valid():               
            address = f"Phone: {form.data['phone_num']}, Apt Num: {form.data['apt_num']}, Line 1: {form.data['address_1']}, Line 2: {form.data['address_2']}"
            form.save()
            # Create  new order Object
            order = Order(user=request.user, address=address, status='pending')
            order.save()
            # Get data from request
            res = request.POST
            cart = res.get('data')
            cart = json.loads(cart)
            for key, cartitem in cart.items():        
                item = Item(name=cartitem['name'], size=cartitem['size'], order=order, category=cartitem['category'])
                for i in range(len(cartitem['toppings'])):
                    topping_num = f'topping_{i+1}'
                    setattr(item, topping_num, cartitem['toppings'][i])
                item.save()

            context = {
                'order': order,
                'order_items': Item.objects.filter(order=order)
            }
            messages.success(request, 'Your order has been plced successfully')
            return redirect('order_detail', order.id)

class OrderList(PermissionRequiredMixin, ListView):
    permission_required = 'staff'
    model = Order
    context_object_name = 'orders'
    ordering = ['-time']



def order_detail(request, pk):
    context = {
        'order': Order.objects.filter(pk=pk).first(),
        'items': Item.objects.filter(order__pk=pk).all()
    }

    return render(request, 'orders/order_detail.html', context)






    


        