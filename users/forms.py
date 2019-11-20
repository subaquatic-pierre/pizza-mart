from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from . models import Address

class UserRegisterForm(UserCreationForm):
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']


class UserUpdateForm(forms.ModelForm):
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ['username', 'email']


class AddressCreationForm(forms.ModelForm):

    class Meta:
        model = Address
        fields = ['phone_num', 'apt_num', 'address_1', 'address_2']
        

class AddressUpdateForm(forms.ModelForm):

    class Meta:

        model = Address
        fields = ['phone_num', 'apt_num', 'address_1', 'address_2']