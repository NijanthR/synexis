import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-[120vh] app-background">
      <div className="w-full max-w-full px-6 py-8 mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">Profile</h1>
          <p className="text-gray-400 text-xs mt-1">
            Manage your Synexis account details.
          </p>
        </div>

        <div className="component-surface border component-border rounded-xl p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">John Doe</p>
              <p className="text-xs text-gray-400">john.doe@example.com</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
              <p className="text-xs text-gray-400">Role</p>
              <p className="text-sm text-white mt-1">ML Engineer</p>
            </div>
            <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
              <p className="text-xs text-gray-400">Team</p>
              <p className="text-sm text-white mt-1">Synexis Lab</p>
            </div>
            <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
              <p className="text-xs text-gray-400">Default workspace</p>
              <p className="text-sm text-white mt-1">Production</p>
            </div>
            <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
              <p className="text-xs text-gray-400">Notifications</p>
              <p className="text-sm text-white mt-1">Enabled</p>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            Update these details by connecting your account settings.
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
