import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Profile = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userGivenName, setUserGivenName] = useState('');
  const [userFamilyName, setUserFamilyName] = useState('');
  const [userPicture, setUserPicture] = useState('');
  const [userLocale, setUserLocale] = useState('');
  const [authProvider, setAuthProvider] = useState('');

  useEffect(() => {
    // Load user data from sessionStorage
    const email = sessionStorage.getItem('userEmail') || 'user@example.com';
    const name = sessionStorage.getItem('userName') || 'User';
    const givenName = sessionStorage.getItem('userGivenName') || '';
    const familyName = sessionStorage.getItem('userFamilyName') || '';
    const picture = sessionStorage.getItem('userPicture') || '';
    const locale = sessionStorage.getItem('userLocale') || 'en';
    const provider = sessionStorage.getItem('authProvider') || 'email';
    
    setUserEmail(email);
    setUserName(name);
    setUserGivenName(givenName);
    setUserFamilyName(familyName);
    setUserPicture(picture);
    setUserLocale(locale);
    setAuthProvider(provider);
  }, []);

  const handleSignOut = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/login');
  };

  return (
    <div className="min-h-[120vh] app-background">
      <div className="w-full max-w-4xl px-6 py-8 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-gray-400 text-sm mt-2">
            Manage your Synexis account and preferences
          </p>
        </div>

        {/* Profile Header Card */}
        <div className="component-surface border component-border rounded-2xl p-8 mb-6 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {userPicture ? (
                  <img 
                    src={userPicture} 
                    alt={userName}
                    className="w-32 h-32 rounded-full ring-4 ring-blue-500/20 object-cover"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      console.log('Image failed to load:', userPicture);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center ring-4 ring-blue-500/20" style={{ display: userPicture ? 'none' : 'flex' }}>
                  <span className="text-4xl font-bold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-gray-900"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{userName}</h2>
                <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {userEmail}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    Active
                  </span>
                  {authProvider === 'google' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-gray-400 component-surface border component-border rounded-lg hover:border-blue-500/30 transition-all duration-200">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Account Details */}
        <div className="component-surface border component-border rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="text-lg font-bold text-white">Account Details</h3>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5 group hover:border-blue-500/30 hover:bg-gray-800/50 transition-all duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</p>
              </div>
              <p className="text-base font-semibold text-white">ML Engineer</p>
            </div>

            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5 group hover:border-blue-500/30 hover:bg-gray-800/50 transition-all duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Team</p>
              </div>
              <p className="text-base font-semibold text-white">Synexis Lab</p>
            </div>

            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5 group hover:border-blue-500/30 hover:bg-gray-800/50 transition-all duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Workspace</p>
              </div>
              <p className="text-base font-semibold text-white">Production</p>
            </div>

            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5 group hover:border-blue-500/30 hover:bg-gray-800/50 transition-all duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Notifications</p>
              </div>
              <p className="text-base font-semibold text-white">Enabled</p>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="component-surface border component-border rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 className="text-lg font-bold text-white">Security</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/50 rounded-xl hover:border-blue-500/30 hover:bg-gray-800/50 transition-all duration-200">
              <div>
                <p className="text-sm font-semibold text-white">Password</p>
                <p className="text-xs text-gray-400 mt-1">Last changed 45 days ago</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-blue-400 border border-blue-500/30 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-all duration-200">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/50 rounded-xl hover:border-blue-500/30 hover:bg-gray-800/50 transition-all duration-200">
              <div>
                <p className="text-sm font-semibold text-white">Two-Factor Authentication</p>
                <p className="text-xs text-gray-400 mt-1">Add an extra layer of security</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-gray-300 border border-gray-600 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all duration-200">
                Enable
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="component-surface border border-red-500/20 rounded-2xl p-6 bg-gradient-to-br from-red-500/5 via-transparent to-transparent">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-bold text-white">Danger Zone</h3>
          </div>
          
          <p className="text-sm text-gray-400 mb-4">
            Once you sign out, you'll need to log in again to access your account.
          </p>

          <button
            type="button"
            onClick={handleSignOut}
            className="px-6 py-3 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
