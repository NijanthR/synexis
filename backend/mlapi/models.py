from django.db import models


class UserCredential(models.Model):
	email = models.CharField(max_length=150, unique=True)
	password_hash = models.CharField(max_length=255)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.email
