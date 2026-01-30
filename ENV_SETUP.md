# Environment Configuration Guide

This project uses environment variables to store sensitive configuration data.

## Backend Setup

1. Copy the example environment file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` file and replace the placeholder values:
   - `SECRET_KEY`: Your Django secret key
   - `GOOGLE_CLIENT_ID`: Your Google OAuth 2.0 Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth 2.0 Client Secret
   - `CHAT_API_KEY`: Your Chat API key (e.g., OpenAI API key)

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Frontend Setup

1. Copy the example environment file:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Edit `.env` file and replace the placeholder values:
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth 2.0 Client ID (same as backend)
   - `VITE_API_URL`: Your backend API URL (default: http://localhost:8000)

## Environment Variables

### Backend (.env)
- `SECRET_KEY`: Django secret key for cryptographic signing
- `DEBUG`: Debug mode (True/False)
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_REDIRECT_URI`: OAuth callback URL
- `CHAT_API_KEY`: API key for chat service

### Frontend (.env)
- `VITE_API_URL`: Backend API base URL
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID (for frontend)
- `VITE_APP_NAME`: Application name

## Security Notes

- Never commit `.env` files to version control
- Keep your API keys and secrets secure
- Use different keys for development and production
- Rotate keys regularly
