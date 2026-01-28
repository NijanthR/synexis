import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
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
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center ring-4 ring-blue-500/20">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-gray-900"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">John Doe</h2>
                <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  john.doe@example.com
                </p>
                <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  Active
                </span>
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
