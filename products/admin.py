from django.contrib import admin
from . models import Item, Size, Category

# Register your models here.

admin.site.register(Item)
admin.site.register(Size)
admin.site.register(Category)