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


class Dataset(models.Model):
	name = models.CharField(max_length=255)
	file = models.FileField(upload_to='datasets/')
	rows = models.IntegerField()
	columns = models.IntegerField()
	size = models.CharField(max_length=50)
	fields = models.JSONField()  # List of column names
	records = models.JSONField()  # Sample records
	user_email = models.CharField(max_length=150, blank=True, null=True)
	uploaded_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.name

	class Meta:
		ordering = ['-uploaded_at']


class ModelComment(models.Model):
	model_id = models.CharField(max_length=100)  # Model identifier (e.g., 'flowers', 'animals')
	user_name = models.CharField(max_length=255)
	user_email = models.CharField(max_length=150)
	user_picture = models.URLField(blank=True, null=True)
	comment = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)
	
	def __str__(self):
		return f"{self.user_name} on {self.model_id}"
	
	class Meta:
		ordering = ['-created_at']
