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
	path("datasets/upload/", views.upload_dataset, name="upload_dataset"),
	path("datasets/", views.list_datasets, name="list_datasets"),
	path("datasets/<int:dataset_id>/", views.delete_dataset, name="delete_dataset"),
	path("comments/add/", views.add_comment, name="add_comment"),
	path("comments/<str:model_id>/", views.get_comments, name="get_comments"),
	path("comments/delete/<int:comment_id>/", views.delete_comment, name="delete_comment"),
]
