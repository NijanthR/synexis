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
  };

  const Section = ({ title, description, children }) => (
    <div className="space-y-2">
      <div>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-[120vh] app-background">
      <div className="w-full max-w-full px-6 py-8 mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-xs mt-1">
            Personalize your Synexis workspace.
          </p>
        </div>

        <div className="component-surface border component-border rounded-xl p-4 space-y-4">
          <Section
            title="Theme"
            description="Choose one of three consistent themes for the entire app."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(themes).map(([key, theme]) => {
                const isActive = selectedTheme === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyTheme(key)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      isActive
                        ? 'border-blue-400 ring-2 ring-blue-400/40'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div
                      className="h-16 rounded-lg border"
                      style={{
                        backgroundColor: theme.appBg,
                        borderColor: theme.componentBorder,
                      }}
                    >
                      <div
                        className="h-4 w-full"
                        style={{
                          backgroundColor: theme.sidebarBg,
                          borderBottom: `1px solid ${theme.sidebarBorder}`,
                        }}
                      />
                      <div
                        className="m-3 h-8 rounded-md"
                        style={{ backgroundColor: theme.componentBg }}
                      />
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-semibold text-white">
                        {theme.label}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {theme.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default Settings;