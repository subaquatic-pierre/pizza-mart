from django.shortcuts import render
from . models import Item, Category, Size
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

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
        'large': Size.objects.get(size='Large')
        }
    return render(request, 'products/index.html', context)

@csrf_exempt
def get_pizza(request):
    data = request.POST['itemName']
    small = Item.objects.filter(name=data, category__name='Regular Pizza', size__size='Small').first()
    large = Item.objects.filter(name=data, category__name='Regular Pizza', size__size='Large').first()
    toppings_query = Item.objects.filter(category__name='Toppings').all()
    toppings = list(item.name for item in toppings_query)
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
        'toppings': toppings
    }
    return JsonResponse(res)