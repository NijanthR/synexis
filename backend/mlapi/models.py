from django.db import models


class UserCredential(models.Model):
	email = models.CharField(max_length=150, unique=True)
	password_hash = models.CharField(max_length=255)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.email


class ApiKey(models.Model):
	provider = models.CharField(max_length=50, unique=True)
	key = models.CharField(max_length=255)
	is_active = models.BooleanField(default=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f"{self.provider} ({'active' if self.is_active else 'inactive'})"
