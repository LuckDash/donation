from django import forms
from django.contrib.auth import logout
from django.contrib.auth.views import LoginView
from django.db.models import Sum, Count
from django.shortcuts import render, redirect
from django.views import View
from django.views.generic import ListView, CreateView

from .admin import UserCreationForm
from .forms import AuthenticationForm
from .models import *



class LandingPageView(ListView):
    model = Institution
    template_name = 'good_hands/index.html'
    extra_context = {'quantity_sum': Donation.objects.aggregate(Sum('quantity')),
                     'institution_count': Donation.objects.aggregate(Count('institution', distinct=True)),
                     'foundations': model.objects.filter(institution_type=1),
                     'organizations': model.objects.filter(institution_type=2),
                     'locals': model.objects.filter(institution_type=3)}

class LoginUserView(LoginView):
    template_name = 'good_hands/login.html'
    form_class = AuthenticationForm

    def get_form(self, form_class=None):
        if form_class is None:
            form_class = self.get_form_class()

        form = super(LoginUserView, self).get_form(form_class)
        form.fields['username'].widget = forms.EmailInput(attrs={'placeholder': 'Email'})
        form.fields['password'].widget = forms.PasswordInput(attrs={'placeholder': 'Hasło'})
        return form

class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect('/')

class AddDonationView(View):
    def get(self, request):
        return render(request, 'good_hands/form.html')

class RegisterView(CreateView):
    form_class = UserCreationForm
    template_name = 'good_hands/register.html'
    success_url = '/login'

    def get_form(self, form_class=None):
        if form_class is None:
            form_class = self.get_form_class()

        form = super(RegisterView, self).get_form(form_class)
        form.fields['first_name'].widget = forms.TextInput(attrs={'placeholder': 'Imię'})
        form.fields['last_name'].widget = forms.TextInput(attrs={'placeholder': 'Nazwisko'})
        form.fields['email'].widget = forms.EmailInput(attrs={'placeholder': 'Email'})
        form.fields['password1'].widget = forms.PasswordInput(attrs={'placeholder': 'Hasło'})
        form.fields['password2'].widget = forms.PasswordInput(attrs={'placeholder': 'Hasło'})
        return form