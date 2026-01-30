from django.urls import path

from . import views


urlpatterns = [
	path("chat/", views.chat, name="chat"),
	path("login/", views.login, name="login"),
	path("signup/", views.signup, name="signup"),
	path("google-auth/", views.google_auth, name="google_auth"),
	path("google-client-id/", views.get_google_client_id, name="get_google_client_id"),
	path("flower/predict/", views.predict_flower, name="predict_flower"),
	path("animal/predict/", views.predict_animal, name="predict_animal"),
]
