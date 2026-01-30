from django.db import models


class UserCredential(models.Model):
	email = models.CharField(max_length=150, unique=True)
	password_hash = models.CharField(max_length=255, blank=True, null=True)
	auth_provider = models.CharField(max_length=50, default='email')  # 'email' or 'google'
	google_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
	full_name = models.CharField(max_length=255, blank=True, null=True)
	profile_picture = models.URLField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.email
