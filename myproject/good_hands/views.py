from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView
from django.db.models import Count, Sum
from django.http import JsonResponse
from django.urls import reverse, reverse_lazy
from django.views.generic import ListView, CreateView
from django.views.generic.edit import FormMixin

from .admin import UserCreationForm
from .forms import DonationForm
from .models import Institution, Donation, MyUser, Category


class LandingPageView(ListView):
    model = Institution
    template_name = 'good_hands/index.html'
    extra_context = {'foundations': model.objects.filter(institution_type=1),
                     'organizations': model.objects.filter(institution_type=2),
                     'locals': model.objects.filter(
                         institution_type=3)}  # TODO: Find way to send all institutions and display it one by one

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['quantity_sum'] = Donation.objects.aggregate(Sum('quantity'))
        context['institution_count'] = Donation.objects.aggregate(Count('institution', distinct=True))
        return context


class LoginUserView(LoginView):
    template_name = 'good_hands/login.html'
    form_class = AuthenticationForm

    def get_form(self, form_class=None):
        if form_class is None:
            form_class = self.get_form_class()

        # TODO: Change to form, correct backend
        form = super(LoginUserView, self).get_form(form_class)
        form.fields['username'].widget = forms.EmailInput(attrs={'placeholder': 'Email'})
        form.fields['password'].widget = forms.PasswordInput(attrs={'placeholder': 'Hasło'})
        return form

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            return self.form_valid(form)
        else:
            email = form.cleaned_data['username']
            try:
                MyUser.objects.get(email=email)
            except MyUser.DoesNotExist:
                return reverse('register')
            return self.form_invalid(form)


class AddDonationView(LoginRequiredMixin, FormMixin, ListView):
    model = Category
    form_class = DonationForm
    template_name = 'good_hands/form.html'
    context_object_name = 'categories_obj'
    extra_context = {'institutions': Institution.objects.all()}

    def post(self, request):
        if request.is_ajax():
            end_data = {}
            form = DonationForm(data=request.POST)
            if form.is_valid():
                bags, categories, organization, address, city, postcode, phone, data, time, more_info = form.cleaned_data.values()
                donation = Donation(quantity=bags,
                                    address=address,
                                    institution_id=organization,
                                    phone_number=phone,
                                    city=city,
                                    zip_code=postcode,
                                    pick_up_date=data,
                                    pick_up_time=time,
                                    pick_up_comment=more_info,
                                    user_id=request.user.id)
                donation.save()
                donation.categories.set(categories)
            return JsonResponse(end_data)


class RegisterView(CreateView):
    form_class = UserCreationForm
    template_name = 'good_hands/register.html'
    success_url = reverse_lazy('login')

    def get_form(self, form_class=None):
        if form_class is None:
            form_class = self.get_form_class()

        # TODO: Change to form
        form = super(RegisterView, self).get_form(form_class)
        form.fields['first_name'].widget = forms.TextInput(attrs={'placeholder': 'Imię'})
        form.fields['last_name'].widget = forms.TextInput(attrs={'placeholder': 'Nazwisko'})
        form.fields['email'].widget = forms.EmailInput(attrs={'placeholder': 'Email'})
        form.fields['password1'].widget = forms.PasswordInput(attrs={'placeholder': 'Hasło'})
        form.fields['password2'].widget = forms.PasswordInput(attrs={'placeholder': 'Hasło'})
        return form
