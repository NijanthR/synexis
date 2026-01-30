import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import spiderSvg from '../assets/spider.svg';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleClientId, setGoogleClientId] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGoogleInitialized, setIsGoogleInitialized] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }

    // Fetch Google Client ID first
    fetchGoogleClientId();

    // Load Google Sign-In script
    loadGoogleScript();
  }, []);

  const fetchGoogleClientId = async () => {
    try {
      const response = await fetch('/api/google-client-id/');
      if (response.ok) {
        const data = await response.json();
        console.log('Google Client ID loaded:', data.client_id?.substring(0, 20) + '...');
        setGoogleClientId(data.client_id);
      } else {
        console.error('Failed to fetch client ID, status:', response.status);
      }
    } catch (err) {
      console.error('Failed to fetch Google client ID:', err);
    }
  };

  const loadGoogleScript = () => {
    if (document.getElementById('google-signin-script')) {
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-signin-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Sign-In script loaded');
      if (googleClientId) {
        initializeGoogleSignIn();
      }
    };
    document.body.appendChild(script);
  };

  const handleGoogleCallback = async (response) => {
    setIsGoogleLoading(true);
    setError('');

    try {
      const result = await fetch('/api/google-auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.credential,
        }),
      });

      if (!result.ok) {
        const data = await result.json().catch(() => null);
        setError(data?.error || 'Google sign-in failed.');
        return;
      }

      const data = await result.json();
      sessionStorage.setItem('isAuthenticated', 'true');
      if (data?.user) {
        sessionStorage.setItem('userEmail', data.user.email);
        sessionStorage.setItem('userName', data.user.name);
        sessionStorage.setItem('userGivenName', data.user.given_name || '');
        sessionStorage.setItem('userFamilyName', data.user.family_name || '');
        sessionStorage.setItem('userLocale', data.user.locale || 'en');
        sessionStorage.setItem('authProvider', data.user.auth_provider || 'google');
        if (data.user.picture) {
          sessionStorage.setItem('userPicture', data.user.picture);
        }
      }
      window.dispatchEvent(new Event('auth-changed'));
      navigate('/dashboard');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const initializeGoogleSignIn = () => {
    if (!googleClientId || !window.google || isGoogleInitialized) {
      console.log('Google Sign-In not ready:', { 
        googleClientId: !!googleClientId, 
        googleLib: !!window.google,
        alreadyInitialized: isGoogleInitialized
      });
      return;
    }

    console.log('Initializing Google Sign-In with client ID:', googleClientId.substring(0, 20) + '...');
    
    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCallback,
      });
      
      setIsGoogleInitialized(true);
      console.log('Google Sign-In initialized successfully');
    } catch (err) {
      console.error('Error initializing Google Sign-In:', err);
    }
  };

  useEffect(() => {
    if (googleClientId && window.google && !isGoogleInitialized) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initializeGoogleSignIn();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [googleClientId, isGoogleInitialized]);

  const handleGoogleSignIn = () => {
    if (!isGoogleInitialized || isGoogleLoading) {
      setError('Google Sign-In is not ready yet. Please wait...');
      return;
    }
    
    setIsGoogleLoading(true);
    setError('');

    // Use OAuth2 Token Client instead of prompt() to avoid FedCM issues
    try {
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: googleClientId,
        scope: 'email profile openid',
        ux_mode: 'popup',
        callback: async (response) => {
          if (response.code) {
            // Send authorization code to backend
            try {
              const result = await fetch('/api/google-auth/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  code: response.code,
                }),
              });

              if (!result.ok) {
                const data = await result.json().catch(() => null);
                setError(data?.error || 'Google sign-in failed.');
                setIsGoogleLoading(false);
                return;
              }

              const data = await result.json();
              sessionStorage.setItem('isAuthenticated', 'true');
              if (data?.user) {
                sessionStorage.setItem('userEmail', data.user.email);
                sessionStorage.setItem('userName', data.user.name);
                if (data.user.picture) {
                  sessionStorage.setItem('userPicture', data.user.picture);
                }
              }
              window.dispatchEvent(new Event('auth-changed'));
              navigate('/dashboard');
            } catch (err) {
              setError('Network error. Please try again.');
              setIsGoogleLoading(false);
            }
          } else {
            setError('Google sign-in was cancelled.');
            setIsGoogleLoading(false);
          }
        },
      });
      
      client.requestCode();
    } catch (err) {
      console.error('Error with Google Sign-In:', err);
      setError('Failed to start Google Sign-In. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error || 'Login failed.');
        return;
      }

      const data = await response.json().catch(() => null);
      sessionStorage.setItem('isAuthenticated', 'true');
      if (data?.token) {
        sessionStorage.setItem('authToken', data.token);
      }
      window.dispatchEvent(new Event('auth-changed'));
      navigate('/dashboard');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen app-background flex items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
            <img 
              src={spiderSvg} 
              alt="Synexis Logo" 
              className="w-10 h-10 filter brightness-0 invert"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Synexis</h1>
          <p className="text-sm text-gray-400">
            Sign in to access your ML workspace
          </p>
        </div>

        <div className="component-surface border component-border rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 component-surface border component-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white placeholder-gray-500 transition-all duration-200"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 component-surface border component-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white placeholder-gray-500 transition-all duration-200"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-blue-600 component-surface border component-border rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 disabled:from-gray-600 disabled:to-gray-600 disabled:text-gray-400 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 disabled:shadow-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>

            {successMessage && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg" role="alert">
                <p className="text-sm text-green-400">{successMessage}</p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg" role="alert">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t component-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="app-background px-3 text-gray-500">Or</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={!isGoogleInitialized || isGoogleLoading}
            className="w-full px-4 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in with Google...
              </>
            ) : !isGoogleInitialized ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/signup')}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>© 2026 Synexis. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
