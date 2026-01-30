# Google Authentication Testing Checklist

Use this checklist to verify your Google OAuth implementation is working correctly.

## Pre-Testing Setup

- [ ] Google OAuth Client ID and Secret obtained from Google Cloud Console
- [ ] Authorized redirect URI added: `http://localhost:5173/dashboard`
- [ ] Backend server running on `http://localhost:8000`
- [ ] Frontend server running on `http://localhost:5173`
- [ ] Google OAuth Config added in Django Admin with credentials
- [ ] "Is active" is checked in Django Admin for OAuth config

## Backend Tests

### Admin Interface
- [ ] Can access Django admin at `http://localhost:8000/admin/`
- [ ] Can see "Google OAuth Configurations" in admin menu
- [ ] Can view/edit the OAuth configuration
- [ ] Client ID and Secret are saved correctly

### API Endpoints
Test these in browser or with curl:

- [ ] **GET** `http://localhost:8000/api/google-client-id/`
  - Should return: `{"client_id": "your-client-id"}`
  - Status: 200 OK

- [ ] **POST** `http://localhost:8000/api/google-auth/`
  - With valid token: Creates/logs in user
  - With invalid token: Returns 401 error
  - Without token: Returns 400 error

## Frontend Tests

### Login Page (`/login`)
- [ ] Page loads without errors (check browser console)
- [ ] "Continue with Google" button is visible
- [ ] Button is enabled (not grayed out)
- [ ] Clicking button opens Google sign-in popup
- [ ] Can select Google account from popup
- [ ] After successful sign-in, redirects to `/dashboard`
- [ ] User is logged in (check sessionStorage)
- [ ] Error messages display correctly for failures

### Signup Page (`/signup`)
- [ ] Page loads without errors
- [ ] "Continue with Google" button is visible
- [ ] Button works same as Login page
- [ ] Creates new account for new Google users
- [ ] Redirects to dashboard after successful signup

## User Experience Tests

### New Google User
- [ ] Click "Continue with Google"
- [ ] Sign in with a Google account (not previously registered)
- [ ] Account is created automatically
- [ ] Redirected to dashboard
- [ ] Email, name, and picture are stored
- [ ] Can access protected pages

### Existing Google User
- [ ] Sign out
- [ ] Click "Continue with Google" again
- [ ] Sign in with same Google account
- [ ] Logged in immediately (no new account created)
- [ ] Redirects to dashboard
- [ ] User data is updated

### Email User Trying Google
- [ ] Create account with email/password
- [ ] Sign out
- [ ] Try to sign in with Google using same email
- [ ] Should show error: "Email already registered with password login"

### Google User Trying Email
- [ ] Sign in with Google first
- [ ] Sign out
- [ ] Try to create account with email/password using same email
- [ ] Should show error about email already registered

## Security Tests

### Token Validation
- [ ] Invalid token rejected
- [ ] Expired token rejected
- [ ] Token with wrong client ID rejected
- [ ] Unverified email rejected (if your Google settings require it)

### CORS Protection
- [ ] API calls from `localhost:5173` work
- [ ] API calls from other origins are blocked

## Error Handling Tests

### Configuration Errors
- [ ] Deactivate OAuth config in admin → Shows "not configured" error
- [ ] Remove client ID → Shows appropriate error
- [ ] Invalid client ID → Shows "invalid token" error

### Network Errors
- [ ] Stop backend server → Shows network error
- [ ] Slow connection → Loading state displays correctly

### User Errors
- [ ] Close Google popup → No error, can try again
- [ ] Cancel Google sign-in → Stays on login page
- [ ] Use non-Google email → Shows appropriate error

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if on Mac)

## Console Checks

### Browser Console (F12)
- [ ] No JavaScript errors on page load
- [ ] No errors when clicking Google button
- [ ] No errors after successful sign-in
- [ ] Google Sign-In library loads successfully

### Backend Console
- [ ] No errors when fetching client ID
- [ ] No errors during token verification
- [ ] User creation/login messages appear (if logging is enabled)

## Session Management

- [ ] User stays logged in after page refresh
- [ ] `sessionStorage` contains:
  - `isAuthenticated`: 'true'
  - `userEmail`: user's email
  - `userName`: user's name
  - `userPicture`: profile picture URL (if available)
- [ ] Logout clears session correctly

## Database Verification

Check Django admin after Google sign-in:

- [ ] New `UserCredential` entry created
- [ ] `auth_provider` is set to 'google'
- [ ] `google_id` is populated
- [ ] `email` is correct
- [ ] `full_name` is populated
- [ ] `profile_picture` URL is stored
- [ ] `password_hash` is null/blank for Google users

## Performance Tests

- [ ] Page loads quickly
- [ ] Google popup opens without delay
- [ ] Sign-in process completes in < 3 seconds
- [ ] No memory leaks (check with browser dev tools)

## Mobile/Responsive Tests (Optional)

- [ ] Works on mobile browsers
- [ ] Google popup is mobile-friendly
- [ ] Buttons are easily clickable on touch devices

## Production Readiness

Before deploying to production:

- [ ] Change redirect URI to production domain in Google Console
- [ ] Update `CORS_ALLOWED_ORIGINS` in Django settings
- [ ] Store Client ID and Secret in environment variables
- [ ] Test with production URLs
- [ ] Verify SSL/HTTPS is working
- [ ] Test OAuth consent screen
- [ ] Review Google API usage quotas

## Common Issues Checklist

If something doesn't work, check:

- [ ] Both servers are running (backend and frontend)
- [ ] Correct ports (8000 for backend, 5173 for frontend)
- [ ] Google OAuth config exists and is active in admin
- [ ] Client ID matches in Google Console and Django admin
- [ ] Redirect URI matches exactly in Google Console
- [ ] Browser allows popups (not blocked)
- [ ] No ad blockers interfering with Google script
- [ ] Internet connection is stable
- [ ] Google Sign-In script loaded (check Network tab)

---

## Quick Debug Commands

```bash
# Check Django admin for OAuth config
http://localhost:8000/admin/mlapi/googleoauthconfig/

# Test client ID endpoint
curl http://localhost:8000/api/google-client-id/

# Check database entries
cd backend
python manage.py shell
>>> from mlapi.models import GoogleOAuthConfig, UserCredential
>>> GoogleOAuthConfig.objects.all()
>>> UserCredential.objects.filter(auth_provider='google')

# Check frontend console
# Open browser console (F12) and check for errors

# Check if Google script loaded
# In browser console: typeof google
# Should return: "object" not "undefined"
```

---

**Testing complete when all checkboxes are checked! ✅**
