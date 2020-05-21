from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Address

@receiver(signal=post_save, sender=User)
def create_address(sender, instance, created, **kwargs):
    if created:
        Address.objects.create(user=instance)


@receiver(signal=post_save, sender=User)
def save_address(sender, instance, **kwargs):
    instance.address.save()
