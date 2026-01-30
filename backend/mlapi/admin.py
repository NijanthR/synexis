from django.contrib import admin
from django.contrib.auth.hashers import make_password
from django import forms

from .models import UserCredential


class UserCredentialForm(forms.ModelForm):
	password = forms.CharField(required=False, widget=forms.PasswordInput)

	class Meta:
		model = UserCredential
		fields = ("email", "password")


@admin.register(UserCredential)
class UserCredentialAdmin(admin.ModelAdmin):
	form = UserCredentialForm
	list_display = ("email", "created_at")
	search_fields = ("email",)

	def save_model(self, request, obj, form, change):
		if obj.email:
			obj.email = obj.email.strip().lower()
		raw_password = form.cleaned_data.get("password") or ""
		if raw_password:
			obj.password_hash = make_password(raw_password)
		super().save_model(request, obj, form, change)
	fieldsets = (
		("OAuth Credentials", {
			"fields": ("client_id", "client_secret", "is_active")
		}),
	)
