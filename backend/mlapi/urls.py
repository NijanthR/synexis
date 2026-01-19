from django.urls import path

from . import views


urlpatterns = [
	path("chat/", views.chat, name="chat"),
	path("login/", views.login, name="login"),
]
