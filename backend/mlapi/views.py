import json
import os
import urllib.request
import urllib.error

from django.http import JsonResponse
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt

from .models import UserCredential


API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_URL = (
	"https://generativelanguage.googleapis.com/v1beta/models/"
	"gemini-2.5-flash:generateContent"
)


def _fallback_response(message):
	text = message.lower().strip()
	if "what can you do" in text or "what do you do" in text or "help" == text:
		return (
			"I can help with Synexis ML tasks like: explaining models, datasets, and "
			"predictions; guiding training or evaluation; troubleshooting errors; and "
			"suggesting next steps for your project. Ask anything specific and I’ll help."
		)

	return (
		"I can help with Synexis ML models, datasets, predictions, and troubleshooting. "
		"Tell me what you’re trying to do and I’ll guide you."
	)


def _ensure_default_user():
	default_email = "nijanth"
	default_password = "2428"

	if not UserCredential.objects.filter(email=default_email).exists():
		UserCredential.objects.create(
			email=default_email,
			password_hash=make_password(default_password),
		)


@csrf_exempt
def login(request):
	if request.method != "POST":
		return JsonResponse({"error": "Method not allowed"}, status=405)

	try:
		payload = json.loads(request.body.decode("utf-8") or "{}")
		email = str(payload.get("email", "")).strip().lower()
		password = str(payload.get("password", ""))
		if not email or not password:
			return JsonResponse({"error": "Email and password are required"}, status=400)

		_ensure_default_user()

		try:
			user = UserCredential.objects.get(email=email)
			if not check_password(password, user.password_hash):
				return JsonResponse({"error": "Invalid credentials"}, status=401)
			return JsonResponse({"ok": True})
		except UserCredential.DoesNotExist:
			pass

		django_user = User.objects.filter(username__iexact=email).first()
		if not django_user and "@" in email:
			django_user = User.objects.filter(email__iexact=email).first()

		if not django_user or not django_user.check_password(password):
			return JsonResponse({"error": "Invalid credentials"}, status=401)

		return JsonResponse({"ok": True})

	except Exception as error:
		return JsonResponse({"error": str(error)}, status=500)


@csrf_exempt
def chat(request):
	if request.method != "POST":
		return JsonResponse({"error": "Method not allowed"}, status=405)

	try:
		payload = json.loads(request.body.decode("utf-8") or "{}")
		message = str(payload.get("message", "")).strip()
		if not message:
			return JsonResponse({"error": "Message is required"}, status=400)

		if not API_KEY:
			return JsonResponse({"error": "Missing GEMINI_API_KEY"}, status=500)

		request_body = {
			"contents": [
				{
					"role": "user",
					"parts": [
						{
							"text": (
								"Answer in one short response. Be clear and only address what is asked.\n"
								f"User: {message}"
							),
						}
					]
				}
			],
			"generationConfig": {
				"temperature": 0.7,
				"maxOutputTokens": 1000,
			},
		}

		url = f"{GEMINI_URL}?key={API_KEY}"
		req = urllib.request.Request(
			url,
			data=json.dumps(request_body).encode("utf-8"),
			headers={"Content-Type": "application/json"},
			method="POST",
		)

		with urllib.request.urlopen(req) as response:
			data = json.loads(response.read().decode("utf-8"))

		ai_text = (
			data.get("candidates", [{}])[0]
			.get("content", {})
			.get("parts", [{}])[0]
			.get("text", "")
		)

		if not ai_text:
			fallback_text = _fallback_response(message)
			return JsonResponse({"text": fallback_text, "fallback": True})

		return JsonResponse({"text": ai_text})

	except urllib.error.HTTPError as error:
		error_body = error.read().decode("utf-8") if error.fp else ""
		fallback_text = _fallback_response(message)
		return JsonResponse(
			{
				"text": fallback_text,
				"fallback": True,
				"error": f"Upstream API error: {error.code}",
				"details": error_body,
			},
		)
	except Exception as error:
		fallback_text = _fallback_response(message)
		return JsonResponse(
			{
				"text": fallback_text,
				"fallback": True,
				"error": str(error),
			},
		)
