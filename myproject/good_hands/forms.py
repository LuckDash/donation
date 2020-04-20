from django import forms

from good_hands.models import Category


class DonationForm(forms.Form):
    bags = forms.IntegerField()
    categories = forms.ModelMultipleChoiceField(queryset=Category.objects.all())
    organization = forms.IntegerField()
    address = forms.CharField()
    city = forms.CharField()
    postcode = forms.CharField()
    phone = forms.CharField()
    data = forms.DateField()
    time = forms.TimeField()
    more_info = forms.CharField()