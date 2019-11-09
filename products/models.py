from django.db import models

class Size(models.Model):
    size = models.CharField(max_length=256)    

    def __str__(self):
        return self.size


class Category(models.Model):
    name = models.CharField(max_length=256)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Item(models.Model):
    TOPPINGS_ALLOWED = [
        (None, 'None'),
        (1, 'One'),
        (2,'Two'),
        (3,'Three'),
        (5,'Five'),
    ]
    name = models.CharField(max_length=256)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    toppings = models.IntegerField(choices=TOPPINGS_ALLOWED, default=None, null=True, blank=True)
    size = models.ForeignKey(Size, null=True, blank=True, on_delete=models.SET_NULL)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f'{self.category}: {self.name} - {self.size}'
        
    class Meta:
        ordering = ['category']