import { useEffect, useMemo, useState } from 'react';

const STORAGE_THEME = 'synexis:theme';

const Settings = () => {
  const themes = useMemo(
    () => ({
      dark: {
        label: 'Dark',
        description: 'Deep slate with soft text contrast.',
        appBg: '#0f172a',
        appText: '#e2e8f0',
        sidebarBg: '#111827',
        sidebarBorder: '#1f2937',
        componentBg: '#1f2937',
        componentBorder: '#374151',
      },
      light: {
        label: 'Light',
        description: 'Clean white surface with dark text.',
        appBg: '#f8fafc',
        appText: '#0f172a',
        sidebarBg: '#ffffff',
        sidebarBorder: '#e2e8f0',
        componentBg: '#ffffff',
        componentBorder: '#e2e8f0',
      },
      night: {
        label: 'Night',
        description: 'Near-black canvas with crisp highlights.',
        appBg: '#0b1120',
        appText: '#f8fafc',
        sidebarBg: '#0b1120',
        sidebarBorder: '#1e293b',
        componentBg: '#111827',
        componentBorder: '#1f2937',
      },
    }),
    [],
  );

  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    predictions: true,
    modelUpdates: true,
  });
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState('en');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_THEME) || 'dark';
    const theme = themes[savedTheme] || themes.dark;
    setSelectedTheme(savedTheme in themes ? savedTheme : 'dark');

    document.documentElement.style.setProperty('--app-bg', theme.appBg);
    document.documentElement.style.setProperty('--app-text', theme.appText);
    document.documentElement.style.setProperty('--sidebar-bg', theme.sidebarBg);
    document.documentElement.style.setProperty('--sidebar-border', theme.sidebarBorder);
    document.documentElement.style.setProperty('--component-bg', theme.componentBg);
    document.documentElement.style.setProperty('--component-border', theme.componentBorder);
    
    // Load saved preferences
    const savedNotifications = localStorage.getItem('synexis:notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    
    const savedAutoSave = localStorage.getItem('synexis:autoSave');
    if (savedAutoSave !== null) {
      setAutoSave(savedAutoSave === 'true');
    }
    
    const savedLanguage = localStorage.getItem('synexis:language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, [themes]);

  const applyTheme = (key) => {
    const theme = themes[key];
    if (!theme) return;
    setSelectedTheme(key);
    localStorage.setItem(STORAGE_THEME, key);

    document.documentElement.style.setProperty('--app-bg', theme.appBg);
    document.documentElement.style.setProperty('--app-text', theme.appText);
    document.documentElement.style.setProperty('--sidebar-bg', theme.sidebarBg);
    document.documentElement.style.setProperty('--sidebar-border', theme.sidebarBorder);
    document.documentElement.style.setProperty('--component-bg', theme.componentBg);
    document.documentElement.style.setProperty('--component-border', theme.componentBorder);
    
    showSuccessMessage('Theme updated successfully');
  };
  
  const handleNotificationChange = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('synexis:notifications', JSON.stringify(updated));
    showSuccessMessage('Notification preferences saved');
  };
  
  const handleAutoSaveToggle = () => {
    const newValue = !autoSave;
    setAutoSave(newValue);
    localStorage.setItem('synexis:autoSave', newValue.toString());
    showSuccessMessage(`Auto-save ${newValue ? 'enabled' : 'disabled'}`);
  };
  
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('synexis:language', lang);
    showSuccessMessage('Language preference saved');
  };
  
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const handleClearCache = () => {
    // Clear specific cache items
    const keysToKeep = [STORAGE_THEME, 'synexis:notifications', 'synexis:autoSave', 'synexis:language', 'authToken', 'isAuthenticated'];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    showSuccessMessage('Cache cleared successfully');
  };

  const Section = ({ title, description, icon, children }) => (
    <div className="component-surface border component-border rounded-xl p-6 hover:border-blue-500/30 transition-all duration-200">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
  
  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-blue-600' : 'component-surface border component-border'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-[120vh] app-background">
      <div className="w-full max-w-6xl px-6 py-10 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-400 text-sm">
                Customize your workspace and manage preferences
              </p>
            </div>
            <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset All
            </button>
          </div>
          
          {/* Success Message */}
          {successMessage && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 animate-fadeIn">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-400">{successMessage}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Appearance Section */}
          <Section
            title="Appearance"
            description="Customize the visual theme of your workspace"
            icon={
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(themes).map(([key, theme]) => {
                const isActive = selectedTheme === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyTheme(key)}
                    className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                      isActive
                        ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/20'
                        : 'border-gray-700 hover:border-gray-600 hover:shadow-lg'
                    }`}
                  >
                    <div
                      className="h-20 rounded-lg border overflow-hidden"
                      style={{
                        backgroundColor: theme.appBg,
                        borderColor: theme.componentBorder,
                      }}
                    >
                      <div
                        className="h-5 w-full flex items-center px-2 gap-1"
                        style={{
                          backgroundColor: theme.sidebarBg,
                          borderBottom: `1px solid ${theme.sidebarBorder}`,
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      </div>
                      <div className="p-2 flex gap-2">
                        <div className="w-8 h-12 rounded" style={{ backgroundColor: theme.sidebarBg }}></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-3 rounded" style={{ backgroundColor: theme.componentBg }}></div>
                          <div className="h-3 rounded w-3/4" style={{ backgroundColor: theme.componentBg }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-white">{theme.label}</p>
                        {isActive && (
                          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{theme.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Notifications Section */}
          <Section
            title="Notifications"
            description="Manage how you receive updates and alerts"
            icon={
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            }
          >
            <div className="space-y-1 divide-y divide-gray-800">
              <ToggleSwitch
                enabled={notifications.email}
                onChange={() => handleNotificationChange('email')}
                label="Email Notifications"
                description="Receive updates and alerts via email"
              />
              <ToggleSwitch
                enabled={notifications.push}
                onChange={() => handleNotificationChange('push')}
                label="Push Notifications"
                description="Get real-time browser notifications"
              />
              <ToggleSwitch
                enabled={notifications.predictions}
                onChange={() => handleNotificationChange('predictions')}
                label="Prediction Alerts"
                description="Notify when predictions complete"
              />
              <ToggleSwitch
                enabled={notifications.modelUpdates}
                onChange={() => handleNotificationChange('modelUpdates')}
                label="Model Updates"
                description="Stay informed about model changes"
              />
            </div>
          </Section>

          {/* Workspace Section */}
          <Section
            title="Workspace"
            description="Configure your working environment preferences"
            icon={
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          >
            <div className="space-y-4">
              <ToggleSwitch
                enabled={autoSave}
                onChange={handleAutoSaveToggle}
                label="Auto-save"
                description="Automatically save your work as you go"
              />
              
              <div className="pt-3 border-t border-gray-800">
                <label className="text-sm font-medium text-white mb-3 block">Language</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { code: 'en', label: 'English', flag: '🇺🇸' },
                    { code: 'es', label: 'Español', flag: '🇪🇸' },
                    { code: 'fr', label: 'Français', flag: '🇫🇷' },
                    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`px-4 py-3 rounded-lg border text-left transition-all duration-200 ${
                        language === lang.code
                          ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                          : 'component-border app-text hover:border-blue-500/30 hover:component-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Data & Privacy Section */}
          <Section
            title="Data & Privacy"
            description="Manage your data storage and privacy settings"
            icon={
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 component-surface border component-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Clear Cache</p>
                    <p className="text-xs text-gray-400">Remove temporary files and data</p>
                  </div>
                </div>
                <button
                  onClick={handleClearCache}
                  className="px-4 py-2 bg-orange-500/10 text-orange-400 text-sm font-medium rounded-lg border border-orange-500/30 hover:bg-orange-500/20 transition-all duration-200"
                >
                  Clear
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 component-surface border component-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Export Data</p>
                    <p className="text-xs text-gray-400">Download your models and predictions</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-lg border border-blue-500/30 hover:bg-blue-500/20 transition-all duration-200">
                  Export
                </button>
              </div>
            </div>
          </Section>

          {/* Advanced Section */}
          <Section
            title="Advanced"
            description="Developer tools and advanced configurations"
            icon={
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 component-surface border component-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm font-medium text-white">API Version</p>
                </div>
                <p className="text-xs text-gray-400 mb-2">Current: v2.1.0</p>
                <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View Docs →</button>
              </div>
              
              <div className="p-4 component-surface border component-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-sm font-medium text-white">Performance</p>
                </div>
                <p className="text-xs text-gray-400 mb-2">Monitor system usage</p>
                <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View Stats →</button>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default Settings;