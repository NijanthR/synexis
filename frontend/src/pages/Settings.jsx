import { useEffect, useMemo, useState } from 'react';

const STORAGE_BG = 'synexis:app-bg';
const STORAGE_TEXT = 'synexis:app-text';
const STORAGE_SIDEBAR_BG = 'synexis:sidebar-bg';
const STORAGE_SIDEBAR_BORDER = 'synexis:sidebar-border';

const Settings = () => {
  const backgroundColors = useMemo(
    () => [
      { name: 'Midnight', value: '#0f172a' },
      { name: 'Slate', value: '#111827' },
      { name: 'Indigo', value: '#1e1b4b' },
      { name: 'Ocean', value: '#0f2a3f' },
      { name: 'Emerald', value: '#064e3b' },
      { name: 'Aubergine', value: '#2a0f2e' },
      { name: 'Snow', value: '#ffffff' },
    ],
    [],
  );

  const textColors = useMemo(
    () => [
      { name: 'Frost', value: '#e2e8f0' },
      { name: 'Pearl', value: '#f8fafc' },
      { name: 'Sky', value: '#bfdbfe' },
      { name: 'Mint', value: '#a7f3d0' },
      { name: 'Rose', value: '#fecdd3' },
      { name: 'Ink', value: '#111827' },
    ],
    [],
  );

  const sidebarColors = useMemo(
    () => [
      { name: 'Graphite', value: '#111827', border: '#1f2937' },
      { name: 'Midnight', value: '#0b1120', border: '#1e293b' },
      { name: 'Ink', value: '#0f172a', border: '#1e293b' },
      { name: 'Plum', value: '#2b0f2e', border: '#3b153f' },
      { name: 'Emerald', value: '#064e3b', border: '#0f766e' },
      { name: 'Pearl', value: '#f8fafc', border: '#e2e8f0' },
    ],
    [],
  );

  const [selectedBackground, setSelectedBackground] = useState(
    backgroundColors[0].value,
  );
  const [selectedText, setSelectedText] = useState(textColors[0].value);
  const [selectedSidebar, setSelectedSidebar] = useState(sidebarColors[0].value);

  useEffect(() => {
    const savedBg = localStorage.getItem(STORAGE_BG) || backgroundColors[0].value;
    const savedText = localStorage.getItem(STORAGE_TEXT) || textColors[0].value;
    const savedSidebarBg =
      localStorage.getItem(STORAGE_SIDEBAR_BG) || sidebarColors[0].value;
    const savedSidebarBorder =
      localStorage.getItem(STORAGE_SIDEBAR_BORDER) || sidebarColors[0].border;

    setSelectedBackground(savedBg);
    setSelectedText(savedText);
    setSelectedSidebar(savedSidebarBg);

    document.documentElement.style.setProperty('--app-bg', savedBg);
    document.documentElement.style.setProperty('--app-text', savedText);
    document.documentElement.style.setProperty('--sidebar-bg', savedSidebarBg);
    document.documentElement.style.setProperty('--sidebar-border', savedSidebarBorder);
  }, [backgroundColors, textColors, sidebarColors]);

  const applyBackground = (value) => {
    setSelectedBackground(value);
    localStorage.setItem(STORAGE_BG, value);
    document.documentElement.style.setProperty('--app-bg', value);
  };

  const applyText = (value) => {
    setSelectedText(value);
    localStorage.setItem(STORAGE_TEXT, value);
    document.documentElement.style.setProperty('--app-text', value);
  };

  const applySidebar = (value, border) => {
    setSelectedSidebar(value);
    localStorage.setItem(STORAGE_SIDEBAR_BG, value);
    localStorage.setItem(STORAGE_SIDEBAR_BORDER, border);
    document.documentElement.style.setProperty('--sidebar-bg', value);
    document.documentElement.style.setProperty('--sidebar-border', border);
  };

  return (
    <div className="min-h-[120vh] app-background">
      <div className="px-6 py-10 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-sm mt-1">
            Personalize your Synexis workspace.
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-white">App background</h2>
            <p className="text-xs text-gray-400 mt-1">
              Pick a background color for the application.
            </p>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
              {backgroundColors.map((color) => {
                const isActive = selectedBackground === color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => applyBackground(color.value)}
                    className={`rounded-xl border transition-all p-3 text-left ${
                      isActive
                        ? 'border-blue-400 ring-2 ring-blue-400/40'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div
                      className="w-full h-16 rounded-lg border border-black/20"
                      style={{ backgroundColor: color.value }}
                    />
                    <p className="text-xs text-gray-200 mt-3 font-medium">
                      {color.name}
                    </p>
                    <p className="text-[11px] text-gray-500">{color.value}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">Text color</h2>
            <p className="text-xs text-gray-400 mt-1">
              Choose the default text color across the app.
            </p>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {textColors.map((color) => {
                const isActive = selectedText === color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => applyText(color.value)}
                    className={`rounded-xl border transition-all p-3 text-left ${
                      isActive
                        ? 'border-blue-400 ring-2 ring-blue-400/40'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div
                      className="w-full h-16 rounded-lg border border-black/20 flex items-center justify-center"
                      style={{ backgroundColor: '#0f172a' }}
                    >
                      <span
                        className="text-sm font-semibold"
                        style={{ color: color.value }}
                      >
                        Aa
                      </span>
                    </div>
                    <p className="text-xs text-gray-200 mt-3 font-medium">
                      {color.name}
                    </p>
                    <p className="text-[11px] text-gray-500">{color.value}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">Sidebar color</h2>
            <p className="text-xs text-gray-400 mt-1">
              Update the sidebar background and divider color.
            </p>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {sidebarColors.map((color) => {
                const isActive = selectedSidebar === color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => applySidebar(color.value, color.border)}
                    className={`rounded-xl border transition-all p-3 text-left ${
                      isActive
                        ? 'border-blue-400 ring-2 ring-blue-400/40'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div
                      className="w-full h-16 rounded-lg border"
                      style={{
                        backgroundColor: color.value,
                        borderColor: color.border,
                      }}
                    />
                    <p className="text-xs text-gray-200 mt-3 font-medium">
                      {color.name}
                    </p>
                    <p className="text-[11px] text-gray-500">{color.value}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;