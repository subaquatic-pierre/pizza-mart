from django.db import models
from django.contrib.auth.models import User

class Address(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_num = models.CharField(max_length=255, null=True, blank=True)
    apt_num = models.CharField(max_length=255, null=True, blank=True)
    address_1 = models.CharField(max_length=255, null=True, blank=True)
    address_2 = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f'{self.user.username} Address'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
