import json
import decimal 
from django.shortcuts import render, redirect
from . models import Item, Category, Size
from django.http import JsonResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from orders.models import Order, Item as OrderItem

# Create your views here.

def index(request):
    context = {
        'regular_pizza': Item.objects.filter(category__name='Regular Pizza').all(),
        'sicilian_pizza': Item.objects.filter(category__name='Sicilian Pizza').all(),
        'toppings': Item.objects.filter(category__name='Toppings').all(),
        'subs': Item.objects.filter(category__name='Subs').all(),
        'pasta': Item.objects.filter(category__name='Pasta').all(),
        'salads': Item.objects.filter(category__name='Salads').all(),
        'dinner_platters': Item.objects.filter(category__name='Dinner Platters').all(),
        'small': Size.objects.get(size='Small'),
        'large': Size.objects.get(size='Large'),
        'toppings': list([topping.name for topping in Item.objects.filter(category__name='Toppings').all()])
        }
    return render(request, 'products/index.html', context)

def get_pizza(request):
    name = request.POST['itemName']
    category = request.POST['category']
    print(f'Name : {name}, Cat: {category}')
    small = Item.objects.filter(name=name, category__name=category, size__size='Small').first()
    large = Item.objects.filter(name=name, category__name=category, size__size='Large').first()    
    toppings_query = Item.objects.filter(category__name='Toppings').all()
    toppings = list(item.name for item in toppings_query)    
    toppings.sort()
    if name == 'Sausage, Peppers and Onions':
        res = {
            'large': {
                'name': large.name,
                'toppings': large.toppings,
                'price': large.price
            }
        }
    else:
        res = {
            'large': {
                'name': large.name,
                'toppings': large.toppings,
                'price': large.price
            },
            'small': {
                'name': small.name,
                'toppings': small.toppings,
                'price': small.price
            },
        }    
    return JsonResponse(res)




    
        


        
