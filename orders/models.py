from django.db import models
from django.contrib.auth.models import User
from time import strftime

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    time = models.DateTimeField(auto_now_add=True)
    OPTIONS = (
        ('pending', 'pending'),
        ('completed', 'completed'),
    )
    status = models.CharField(max_length=255, choices=OPTIONS)

    def __str__(self):
        return f'No. {self.id} \nDelivery Address: {self.address} \nTime order was placed: {self.time.strftime("%Y-%m-%d %H:%M:%S")} \nOrder Placed by: {self.user}'

class Item(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    size = models.CharField(max_length=255)
    topping_1 = models.CharField(max_length=255, blank=True, null=True)
    topping_2 = models.CharField(max_length=255, blank=True, null=True)
    topping_3 = models.CharField(max_length=255, blank=True, null=True)
    topping_4 = models.CharField(max_length=255, blank=True, null=True)
    topping_5 = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f'{self.category} : {self.name} \n - Toppings: {self.topping_1}, {self.topping_2}, {self.topping_3}, {self.topping_4}, {self.topping_5}'

