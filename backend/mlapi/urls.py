from django.urls import path

from . import views


urlpatterns = [
	path("chat/", views.chat, name="chat"),
	path("login/", views.login, name="login"),
	path("flower/predict/", views.predict_flower, name="predict_flower"),
	path("animal/predict/", views.predict_animal, name="predict_animal"),
]
