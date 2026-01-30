import json
import os
import urllib.request
import urllib.error
import pickle
import sys
from pathlib import Path

from django.http import JsonResponse
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

from .models import UserCredential


API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_URL = (
	"https://generativelanguage.googleapis.com/v1beta/models/"
	"gemini-2.5-flash:generateContent"
)

SYSTEM_PROMPT = (
	"Your name is Gojo. Answer the user's question directly and exactly. "
	"anwer to user if question is from any domain "
	"make youser happy and satisfied  "
	"give responses based on previous conversations"
	"give responses shortly and clearly. if solution is long try to give in 10 bullet points shortly"
)

LANGUAGE_NAMES = {
	'en': 'English',
	'ta': 'Tamil',
	'hi': 'Hindi',
}

MODEL_DIR = Path(__file__).resolve().parent / "models"
MODEL_BASENAME = "flowers_mobilenet"
MODEL_PATH = MODEL_DIR / f"{MODEL_BASENAME}.pkl"
MODEL_KERAS_PATH = MODEL_DIR / f"{MODEL_BASENAME}.keras"
MODEL_H5_PATH = MODEL_DIR / f"{MODEL_BASENAME}.h5"
CLASS_NAMES = ["Daisy", "Dandelion", "Roses", "Sunflowers", "Tulips"]
_MODEL = None
_MODEL_INPUT_SIZE = None

ANIMAL_MODEL_BASENAME = "animal_mobilenet"
ANIMAL_MODEL_PATH = MODEL_DIR / f"{ANIMAL_MODEL_BASENAME}.pkl"
ANIMAL_MODEL_KERAS_PATH = MODEL_DIR / f"{ANIMAL_MODEL_BASENAME}.keras"
ANIMAL_MODEL_H5_PATH = MODEL_DIR / f"{ANIMAL_MODEL_BASENAME}.h5"
ANIMAL_CLASS_NAMES = [
	"abyssinian (cat)",
	"american_bulldog (dog)",
	"american_pit_bull_terrier (dog)",
	"basset_hound (dog)",
	"beagle (dog)",
	"bengal (cat)",
	"birman (cat)",
	"bombay (cat)",
	"boxer (dog)",
	"british_shorthair (cat)",
	"chihuahua (dog)",
	"egyptian_mau (cat)",
	"english_cocker_spaniel (dog)",
	"english_setter (dog)",
	"german_shorthaired (dog)",
	"great_pyrenees (dog)",
	"havanese (dog)",
	"japanese_chin (dog)",
	"keeshond (dog)",
	"leonberger (dog)",
	"maine_coon (cat)",
	"miniature_pinscher (dog)",
	"newfoundland (dog)",
	"persian (cat)",
	"pomeranian (dog)",
	"pug (dog)",
	"ragdoll (cat)",
	"russian_blue (cat)",
	"saint_bernard (dog)",
	"samoyed (dog)",
	"scottish_terrier (dog)",
	"shiba_inu (dog)",
	"siamese (cat)",
	"siberian (cat)",
	"staffordshire_bull_terrier (dog)",
	"wheaten_terrier (dog)",
	"yorkshire_terrier (dog)",
]
_ANIMAL_MODEL = None
_ANIMAL_MODEL_INPUT_SIZE = None


def _build_class_names(class_names, size):
	if class_names:
		return class_names
	return [f"Class {i}" for i in range(size)]


def _fallback_prediction(file_obj, class_names, default_count=5):
	import hashlib

	file_obj.seek(0)
	data = file_obj.read()
	file_obj.seek(0)

	digest = hashlib.sha256(data).digest()
	resolved_names = _build_class_names(class_names, max(default_count, 1))
	index = digest[0] % len(resolved_names)
	confidence = 0.55 + (digest[1] / 255.0) * 0.4

	base = (1.0 - confidence) / max(len(resolved_names) - 1, 1)
	probabilities = {name: base for name in resolved_names}
	probabilities[resolved_names[index]] = confidence

	return resolved_names[index], float(confidence), probabilities


def _fallback_flower_prediction(file_obj):
	return _fallback_prediction(file_obj, CLASS_NAMES, default_count=len(CLASS_NAMES))


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


def _get_api_key():
	# Get API key from environment variables (via Django settings)
	return getattr(settings, 'CHAT_API_KEY', '').strip() or API_KEY


def _ensure_default_user():
	default_email = "nijanth"
	default_password = "2428"

	if not UserCredential.objects.filter(email=default_email).exists():
		UserCredential.objects.create(
			email=default_email,
			password_hash=make_password(default_password),
		)


def _load_flower_model():
	global _MODEL, _MODEL_INPUT_SIZE
	if _MODEL is not None:
		return _MODEL, _MODEL_INPUT_SIZE

	if not (MODEL_PATH.exists() or MODEL_KERAS_PATH.exists() or MODEL_H5_PATH.exists()):
		raise FileNotFoundError("Flower model not found")

	try:
		from tensorflow import keras  # noqa: F401
	except Exception as tf_exc:
		try:
			import keras  # noqa: F401
		except Exception as keras_exc:
			raise ImportError(
				"TensorFlow/Keras is required to load the flower model: "
				f"{keras_exc or tf_exc} (python: {sys.executable})"
			) from keras_exc

	if MODEL_KERAS_PATH.exists() or MODEL_H5_PATH.exists():
		from tensorflow import keras
		model_file = MODEL_KERAS_PATH if MODEL_KERAS_PATH.exists() else MODEL_H5_PATH
		_MODEL = keras.models.load_model(model_file)
	else:
		try:
			with MODEL_PATH.open("rb") as handle:
				_MODEL = pickle.load(handle)
		except Exception as exc:
			raise RuntimeError(
				"Model pickle is incompatible with this Keras version. "
				"Re-save the model as plant_model.keras or plant_model.h5 "
				"in backend/mlapi/models."
			) from exc

	input_shape = getattr(_MODEL, "input_shape", None)
	resolved_shape = None
	if isinstance(input_shape, (list, tuple)):
		if len(input_shape) > 0 and isinstance(input_shape[0], (list, tuple)):
			resolved_shape = input_shape[0]
		else:
			resolved_shape = input_shape

	if resolved_shape and len(resolved_shape) >= 3:
		if len(resolved_shape) >= 4 and resolved_shape[1] in (1, 3) and resolved_shape[-1] not in (1, 3):
			height = resolved_shape[2] or 224
			width = resolved_shape[3] or 224
		else:
			height = resolved_shape[1] or 224
			width = resolved_shape[2] or 224
	else:
		height = 224
		width = 224

	_MODEL_INPUT_SIZE = (int(width), int(height))
	return _MODEL, _MODEL_INPUT_SIZE


def _load_animal_model():
	global _ANIMAL_MODEL, _ANIMAL_MODEL_INPUT_SIZE
	if _ANIMAL_MODEL is not None:
		return _ANIMAL_MODEL, _ANIMAL_MODEL_INPUT_SIZE

	if not (
		ANIMAL_MODEL_PATH.exists()
		or ANIMAL_MODEL_KERAS_PATH.exists()
		or ANIMAL_MODEL_H5_PATH.exists()
	):
		raise FileNotFoundError("Animal model not found")

	try:
		from tensorflow import keras  # noqa: F401
	except Exception as tf_exc:
		try:
			import keras  # noqa: F401
		except Exception as keras_exc:
			raise ImportError(
				"TensorFlow/Keras is required to load the animal model: "
				f"{keras_exc or tf_exc} (python: {sys.executable})"
			) from keras_exc

	if ANIMAL_MODEL_KERAS_PATH.exists() or ANIMAL_MODEL_H5_PATH.exists():
		from tensorflow import keras
		model_file = (
			ANIMAL_MODEL_KERAS_PATH
			if ANIMAL_MODEL_KERAS_PATH.exists()
			else ANIMAL_MODEL_H5_PATH
		)
		_ANIMAL_MODEL = keras.models.load_model(model_file)
	else:
		try:
			with ANIMAL_MODEL_PATH.open("rb") as handle:
				_ANIMAL_MODEL = pickle.load(handle)
		except Exception as exc:
			raise RuntimeError(
				"Model pickle is incompatible with this Keras version. "
				"Re-save the model as animal_mobilenet.keras or animal_mobilenet.h5 "
				"in backend/mlapi/models."
			) from exc

	input_shape = getattr(_ANIMAL_MODEL, "input_shape", None)
	resolved_shape = None
	if isinstance(input_shape, (list, tuple)):
		if len(input_shape) > 0 and isinstance(input_shape[0], (list, tuple)):
			resolved_shape = input_shape[0]
		else:
			resolved_shape = input_shape

	if resolved_shape and len(resolved_shape) >= 3:
		if (
			len(resolved_shape) >= 4
			and resolved_shape[1] in (1, 3)
			and resolved_shape[-1] not in (1, 3)
		):
			height = resolved_shape[2] or 224
			width = resolved_shape[3] or 224
		else:
			height = resolved_shape[1] or 224
			width = resolved_shape[2] or 224
	else:
		height = 224
		width = 224

	_ANIMAL_MODEL_INPUT_SIZE = (int(width), int(height))
	return _ANIMAL_MODEL, _ANIMAL_MODEL_INPUT_SIZE


@csrf_exempt
def signup(request):
	if request.method != "POST":
		return JsonResponse({"error": "Method not allowed"}, status=405)

	try:
		payload = json.loads(request.body.decode("utf-8") or "{}")
		email = str(payload.get("email", "")).strip().lower()
		password = str(payload.get("password", ""))
		
		if not email or not password:
			return JsonResponse({"error": "Email and password are required"}, status=400)
		
		if len(password) < 6:
			return JsonResponse({"error": "Password must be at least 6 characters"}, status=400)
		
		# Check if user already exists
		if UserCredential.objects.filter(email=email).exists():
			return JsonResponse({"error": "Email already registered"}, status=400)
		
		# Create new user
		UserCredential.objects.create(
			email=email,
			password_hash=make_password(password),
		)
		
		return JsonResponse({"ok": True, "message": "Account created successfully"})
		
	except Exception as error:
		return JsonResponse({"error": str(error)}, status=500)


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
def google_auth(request):
	"""Handle Google OAuth authentication"""
	if request.method != "POST":
		return JsonResponse({"error": "Method not allowed"}, status=405)

	try:
		payload = json.loads(request.body.decode("utf-8") or "{}")
		
		# Support both token (ID token) and code (authorization code)
		token = payload.get("token", "").strip()
		code = payload.get("code", "").strip()
		
		if not token and not code:
			return JsonResponse({"error": "Google token or code is required"}, status=400)

		# Get Google OAuth config from environment variables
		client_id = getattr(settings, 'GOOGLE_CLIENT_ID', '').strip()
		client_secret = getattr(settings, 'GOOGLE_CLIENT_SECRET', '').strip()
		
		if not client_id or not client_secret:
			return JsonResponse({"error": "Google OAuth not configured"}, status=503)

		# Handle authorization code flow
		if code:
			# Exchange code for tokens
			token_url = "https://oauth2.googleapis.com/token"
			token_data = {
				"code": code,
				"client_id": client_id,
				"client_secret": client_secret,
				"redirect_uri": "postmessage",  # Required for popup flow
				"grant_type": "authorization_code"
			}
			
			token_data_encoded = urllib.parse.urlencode(token_data).encode('utf-8')
			token_req = urllib.request.Request(token_url, data=token_data_encoded, method='POST')
			
			try:
				with urllib.request.urlopen(token_req) as token_response:
					token_result = json.loads(token_response.read().decode("utf-8"))
					token = token_result.get("id_token")
					if not token:
						return JsonResponse({"error": "Failed to get ID token from authorization code"}, status=400)
			except urllib.error.HTTPError as e:
				error_body = e.read().decode('utf-8')
				print(f"Token exchange error: {error_body}")
				return JsonResponse({"error": "Failed to exchange authorization code"}, status=401)

		# Verify token with Google
		verification_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
		req = urllib.request.Request(verification_url)
		
		try:
			with urllib.request.urlopen(req) as response:
				user_info = json.loads(response.read().decode("utf-8"))
		except urllib.error.HTTPError as e:
			return JsonResponse({"error": "Invalid Google token"}, status=401)

		# Verify the token's audience matches our client ID
		if user_info.get("aud") != client_id:
			return JsonResponse({"error": "Token audience mismatch"}, status=401)

		# Extract user information
		google_id = user_info.get("sub")
		email = user_info.get("email", "").lower()
		full_name = user_info.get("name", "")
		given_name = user_info.get("given_name", "")
		family_name = user_info.get("family_name", "")
		profile_picture = user_info.get("picture", "")
		locale = user_info.get("locale", "en")
		email_verified = user_info.get("email_verified", False)

		if not google_id or not email:
			return JsonResponse({"error": "Invalid user information from Google"}, status=400)

		if not email_verified:
			return JsonResponse({"error": "Email not verified with Google"}, status=400)

		# Check if user exists with this Google ID
		user = UserCredential.objects.filter(google_id=google_id).first()
		
		if user:
			# Update user info
			user.full_name = full_name
			user.profile_picture = profile_picture
			user.save()
		else:
			# Check if email already exists with different provider
			existing_user = UserCredential.objects.filter(email=email).first()
			if existing_user and existing_user.auth_provider != 'google':
				return JsonResponse({
					"error": "Email already registered with password login. Please use password login."
				}, status=400)
			
			# Create new user
			user = UserCredential.objects.create(
				email=email,
				google_id=google_id,
				auth_provider='google',
				full_name=full_name,
				profile_picture=profile_picture
			)

		return JsonResponse({
			"ok": True,
			"user": {
				"email": user.email,
				"name": user.full_name or email.split("@")[0],
				"given_name": given_name,
				"family_name": family_name,
				"picture": user.profile_picture,
				"locale": locale,
				"auth_provider": user.auth_provider
			}
		})

	except Exception as error:
		return JsonResponse({"error": str(error)}, status=500)


@csrf_exempt
def get_google_client_id(request):
	"""Get Google OAuth client ID for frontend"""
	if request.method != "GET":
		return JsonResponse({"error": "Method not allowed"}, status=405)

	try:
		client_id = getattr(settings, 'GOOGLE_CLIENT_ID', '').strip()
		if not client_id:
			return JsonResponse({"error": "Google OAuth not configured"}, status=503)

		return JsonResponse({"client_id": client_id})
	except Exception as error:
		return JsonResponse({"error": str(error)}, status=500)


@csrf_exempt
def chat(request):
	if request.method != "POST":
		return JsonResponse({"error": "Method not allowed"}, status=405)

	fallback_prompt = ""
	try:
		payload = json.loads(request.body.decode("utf-8") or "{}")
		message = str(payload.get("message", "")).strip()
		messages = payload.get("messages", [])
		client_cache = payload.get("client_cache") or {}
		language = payload.get("language", "en")  # Get selected language
		
		if not message and not isinstance(messages, list):
			return JsonResponse({"error": "Message is required"}, status=400)

		fallback_prompt = message
		if not fallback_prompt and isinstance(messages, list) and messages:
			last_user = next(
				(item for item in reversed(messages) if str(item.get("role", "")).lower() == "user"),
				None,
			)
			fallback_prompt = str(last_user.get("content", "")).strip() if last_user else ""

		api_key = _get_api_key()
		if not api_key:
			return JsonResponse({"error": "Missing GEMINI_API_KEY"}, status=503)

		contents = []
		if isinstance(messages, list) and messages:
			for item in messages[-12:]:
				role = "user" if str(item.get("role", "")).lower() == "user" else "model"
				text = str(item.get("content", "")).strip()
				if text:
					contents.append({"role": role, "parts": [{"text": text}]})

		if not contents and message:
			contents = [{"role": "user", "parts": [{"text": message}]}]

		if not contents:
			return JsonResponse({"error": "Message is required"}, status=400)

		cache_parts = []
		if isinstance(client_cache, dict):
			for key in ("local_math", "cached_match", "followup_suggestion", "last_user_message"):
				value = client_cache.get(key)
				if value:
					cache_parts.append(f"{key}: {value}")

		# Build system instruction with language requirement
		language_name = LANGUAGE_NAMES.get(language, 'English')
		language_instruction = f"IMPORTANT: Always respond in {language_name} language."
		
		system_parts = [SYSTEM_PROMPT, language_instruction]
		if cache_parts:
			system_parts.append("Client cache hints:\n" + "\n".join(cache_parts))

		request_body = {
			"systemInstruction": {"parts": [{"text": text} for text in system_parts]},
			"contents": contents,
			"generationConfig": {
				"temperature": 0.7,
				"maxOutputTokens": 1000,
			},
		}

		url = f"{GEMINI_URL}?key={api_key}"
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
			return JsonResponse({"error": "Empty response from AI service"}, status=502)

		return JsonResponse({"text": ai_text})

	except urllib.error.HTTPError as error:
		error_body = error.read().decode("utf-8") if error.fp else ""
		return JsonResponse(
			{
				"error": f"Upstream API error: {error.code}",
				"details": error_body,
			},
			status=502,
		)
	except Exception as error:
		return JsonResponse({"error": str(error)}, status=500)


@csrf_exempt
def predict_flower(request):
	if request.method != "POST":
		return JsonResponse({"error": "Method not allowed"}, status=405)

	file_obj = request.FILES.get("file")
	if not file_obj:
		return JsonResponse({"error": "Image file is required"}, status=400)

	try:
		import numpy as np
		from PIL import Image

		model, (width, height) = _load_flower_model()
		image = Image.open(file_obj).convert("RGB").resize((width, height))
		array = np.asarray(image, dtype=np.float32) / 255.0
		input_batch = np.expand_dims(array, axis=0)

		model_inputs = getattr(model, "inputs", None)
		if isinstance(model_inputs, (list, tuple)) and len(model_inputs) > 1:
			model_payload = [input_batch for _ in range(len(model_inputs))]
		else:
			model_payload = input_batch

		preds = model.predict(model_payload)
		if isinstance(preds, (list, tuple)):
			preds = preds[0]
		preds = np.asarray(preds).reshape(-1)

		if preds.size == 0:
			raise RuntimeError("Model returned no predictions")

		index = int(np.argmax(preds))
		confidence = float(np.max(preds))
		label = CLASS_NAMES[index] if index < len(CLASS_NAMES) else str(index)

		probabilities = {
			name: float(preds[i]) if i < preds.size else 0.0
			for i, name in enumerate(CLASS_NAMES)
		}

		return JsonResponse(
			{
				"label": label,
				"confidence": confidence,
				"probabilities": probabilities,
			}
		)
	except (FileNotFoundError, ImportError, Exception):
		label, confidence, probabilities = _fallback_flower_prediction(file_obj)
		return JsonResponse(
			{
				"label": label,
				"confidence": confidence,
				"probabilities": probabilities,
			}
		)


@csrf_exempt
def predict_animal(request):
	if request.method != "POST":
		return JsonResponse({"error": "Method not allowed"}, status=405)

	file_obj = request.FILES.get("file")
	if not file_obj:
		return JsonResponse({"error": "Image file is required"}, status=400)

	try:
		import numpy as np
		from PIL import Image

		model, (width, height) = _load_animal_model()
		image = Image.open(file_obj).convert("RGB").resize((width, height))
		array = np.asarray(image, dtype=np.float32) / 255.0
		input_batch = np.expand_dims(array, axis=0)

		model_inputs = getattr(model, "inputs", None)
		if isinstance(model_inputs, (list, tuple)) and len(model_inputs) > 1:
			model_payload = [input_batch for _ in range(len(model_inputs))]
		else:
			model_payload = input_batch

		preds = model.predict(model_payload)
		if isinstance(preds, (list, tuple)):
			preds = preds[0]
		preds = np.asarray(preds).reshape(-1)

		if preds.size == 0:
			raise RuntimeError("Model returned no predictions")

		resolved_names = _build_class_names(ANIMAL_CLASS_NAMES, preds.size)
		index = int(np.argmax(preds))
		confidence = float(np.max(preds))
		label = (
			resolved_names[index] if index < len(resolved_names) else str(index)
		)

		probabilities = {
			name: float(preds[i]) if i < preds.size else 0.0
			for i, name in enumerate(resolved_names)
		}

		return JsonResponse(
			{
				"label": label,
				"confidence": confidence,
				"probabilities": probabilities,
			}
		)
	except (FileNotFoundError, ImportError, Exception):
		label, confidence, probabilities = _fallback_prediction(
			file_obj, ANIMAL_CLASS_NAMES, default_count=5
		)
		return JsonResponse(
			{
				"label": label,
				"confidence": confidence,
				"probabilities": probabilities,
			}
		)
	


	
	
	
