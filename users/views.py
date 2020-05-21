from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from . forms import UserRegisterForm, UserUpdateForm, AddressUpdateForm, AddressCreationForm

def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}! You are now able to login')
            return redirect('login')
    else:
        form = UserRegisterForm()
        a_form = AddressCreationForm()
    
    context = {'form': form}
    return render(request, 'users/register.html', context)


@login_required
def profile(request):
    if request.method == 'POST': 
        u_form = UserUpdateForm(request.POST, instance=request.user)
        a_form = AddressUpdateForm(request.POST, instance=request.user.address)

        if u_form.is_valid() and a_form.is_valid():
            u_form.save()
            a_form.save()
            messages.success(request, f'Your account has been updated successfuly')
            return redirect('profile')
    else:
        u_form = UserUpdateForm(instance=request.user)
        p_form = AddressUpdateForm(instance=request.user.address)

    context = {'u_form':u_form, 'p_form':p_form}
    return render(request, 'users/profile.html', context)

def index(request):
    context = {'hello': 'The best User index view'}
    return render(request, 'users/index.html', context)