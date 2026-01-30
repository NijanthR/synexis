# Google Authentication Setup Guide

## Overview
Google OAuth authentication has been implemented in your Synexis application. Users can now sign in with their Google accounts.

## Setup Instructions

### 1. Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** or **Google Identity Services**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if prompted
6. Set **Application type** to "Web application"
7. **IMPORTANT:** Add **Authorized JavaScript origins** (required for popup sign-in):
   - `http://localhost:5173`
8. Add **Authorized redirect URIs**:
   - `http://localhost:5173`
   - `http://localhost:5173/`
   - `http://localhost:5173/dashboard`
9. Copy the **Client ID** and **Client Secret**

### 2. Configure Django Admin

1. Start your Django server:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. Go to Django admin: `http://localhost:8000/admin/`

3. Login with your admin credentials (create superuser if needed):
   ```bash
   python manage.py createsuperuser
   ```

4. Navigate to **Google OAuth Configurations** → **Add Google OAuth Configuration**

5. Enter your credentials:
   - **Client ID**: Paste your Google Client ID
   - **Client Secret**: Paste your Google Client Secret
   - **Is active**: ✓ (checked)

6. Click **Save**

### 3. Test the Integration

1. Make sure both servers are running:
   - Backend: `cd backend && python manage.py runserver`
   - Frontend: `cd frontend && npm run dev`

2. Go to `http://localhost:5173/` and click on the Login page

3. Click "Continue with Google" button

4. Sign in with your Google account

5. You'll be redirected to the dashboard upon successful authentication

## Important Notes

### Security Considerations
- Never commit your Client ID and Secret to version control
- In production, use environment variables for sensitive data
- Make sure to add your production domain to authorized redirect URIs in Google Console

### Authorized Redirect URI
The OAuth redirect URL is configured to: **`http://localhost:5173/dashboard`**

This matches the setting you specified. If you need to change this:
1. Update it in Google Cloud Console under your OAuth 2.0 Client ID
2. The current implementation redirects users to `/dashboard` after successful authentication

### User Data Storage
The system stores the following from Google:
- Email address
- Full name
- Profile picture URL
- Google ID (for authentication)

### Multiple Sign-in Methods
- Users who sign up with email/password cannot use Google sign-in with the same email
- Users who sign in with Google are marked as `auth_provider='google'` in the database
- This prevents conflicts between authentication methods

## Troubleshooting

### "Can't continue with google.com" error
**This is the most common error!**
- Go to Google Cloud Console → Credentials → Your OAuth 2.0 Client ID
- Make sure **Authorized JavaScript origins** includes: `http://localhost:5173`
- This is REQUIRED for Google Sign-In to work with popup mode
- Wait 1-2 minutes after saving for changes to propagate

### "Google OAuth not configured" error
- Make sure you've added the Google OAuth configuration in Django admin
- Check that "Is active" is enabled

### "Invalid Google token" error
- Verify your Client ID matches in both Google Console and Django admin
- Check that the redirect URI is correctly configured

### Google Sign-In button not working
- Check browser console for JavaScript errors
- Ensure the Google Sign-In library is loading (check Network tab)
- Verify that the client ID is being fetched from the backend

### CORS errors
- CORS is configured for `http://localhost:5173`
- If you change the frontend port, update `CORS_ALLOWED_ORIGINS` in `backend/backend/settings.py`

## API Endpoints

The following endpoints have been added:

1. **GET** `/api/google-client-id/` - Fetches Google Client ID for frontend
2. **POST** `/api/google-auth/` - Handles Google OAuth authentication
   - Body: `{ "token": "google_id_token" }`
   - Returns user data on success

## Files Modified

### Backend:
- `backend/mlapi/models.py` - Added `GoogleOAuthConfig` model and updated `UserCredential`
- `backend/mlapi/views.py` - Added `google_auth()` and `get_google_client_id()` functions
- `backend/mlapi/urls.py` - Added new URL patterns
- `backend/mlapi/admin.py` - Added admin interface for Google OAuth config
- `backend/backend/settings.py` - Added CORS configuration

### Frontend:
- `frontend/src/pages/Login.jsx` - Integrated Google Sign-In

## Next Steps

After setting up:
1. Test the login flow thoroughly
2. Consider adding similar Google OAuth to the Signup page
3. Add user profile management to update/view Google profile data
4. Implement token refresh for long sessions (optional)
5. Add analytics to track sign-in methods

## Support

If you encounter any issues:
1. Check Django logs: `python manage.py runserver` terminal output
2. Check browser console for frontend errors
3. Verify all configuration steps were completed
4. Ensure both backend and frontend servers are running
