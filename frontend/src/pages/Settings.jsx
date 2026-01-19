import { useEffect, useMemo, useState } from 'react';

const STORAGE_BG = 'synexis:app-bg';
const STORAGE_TEXT = 'synexis:app-text';
const STORAGE_SIDEBAR_BG = 'synexis:sidebar-bg';
const STORAGE_SIDEBAR_BORDER = 'synexis:sidebar-border';
const STORAGE_COMPONENT_BG = 'synexis:component-bg';
const STORAGE_COMPONENT_BORDER = 'synexis:component-border';

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

  const componentColors = useMemo(
    () => [
      { name: 'Charcoal', value: '#1f2937', border: '#374151' },
      { name: 'Slate', value: '#111827', border: '#1f2937' },
      { name: 'Indigo', value: '#1e1b4b', border: '#312e81' },
      { name: 'Ocean', value: '#0f2a3f', border: '#1f3b57' },
      { name: 'Emerald', value: '#064e3b', border: '#0f766e' },
      { name: 'Pearl', value: '#f1f5f9', border: '#e2e8f0' },
    ],
    [],
  );

  const [selectedBackground, setSelectedBackground] = useState(
    backgroundColors[0].value,
  );
  const [selectedText, setSelectedText] = useState(textColors[0].value);
  const [selectedSidebar, setSelectedSidebar] = useState(sidebarColors[0].value);
  const [selectedComponent, setSelectedComponent] = useState(
    componentColors[0].value,
  );

  useEffect(() => {
    const savedBg = localStorage.getItem(STORAGE_BG) || backgroundColors[0].value;
    const savedText = localStorage.getItem(STORAGE_TEXT) || textColors[0].value;
    const savedSidebarBg =
      localStorage.getItem(STORAGE_SIDEBAR_BG) || sidebarColors[0].value;
    const savedSidebarBorder =
      localStorage.getItem(STORAGE_SIDEBAR_BORDER) || sidebarColors[0].border;
    const savedComponentBg =
      localStorage.getItem(STORAGE_COMPONENT_BG) || componentColors[0].value;
    const savedComponentBorder =
      localStorage.getItem(STORAGE_COMPONENT_BORDER) || componentColors[0].border;

    setSelectedBackground(savedBg);
    setSelectedText(savedText);
    setSelectedSidebar(savedSidebarBg);
    setSelectedComponent(savedComponentBg);

    document.documentElement.style.setProperty('--app-bg', savedBg);
    document.documentElement.style.setProperty('--app-text', savedText);
    document.documentElement.style.setProperty('--sidebar-bg', savedSidebarBg);
    document.documentElement.style.setProperty('--sidebar-border', savedSidebarBorder);
    document.documentElement.style.setProperty('--component-bg', savedComponentBg);
    document.documentElement.style.setProperty('--component-border', savedComponentBorder);
  }, [backgroundColors, textColors, sidebarColors, componentColors]);

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

  const applyComponent = (value, border) => {
    setSelectedComponent(value);
    localStorage.setItem(STORAGE_COMPONENT_BG, value);
    localStorage.setItem(STORAGE_COMPONENT_BORDER, border);
    document.documentElement.style.setProperty('--component-bg', value);
    document.documentElement.style.setProperty('--component-border', border);
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
            title="App background"
            description="Pick a background color for the application."
          >
            <div className="grid grid-cols-7 sm:grid-cols-10 lg:grid-cols-14 gap-2">
              {backgroundColors.map((color) => {
                const isActive = selectedBackground === color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => applyBackground(color.value)}
                    title={color.name}
                    aria-label={color.name}
                    className={`rounded-md border transition-all p-1 ${
                      isActive
                        ? 'border-blue-400 ring-2 ring-blue-400/40'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded border border-black/20"
                      style={{ backgroundColor: color.value }}
                    />
                  </button>
                );
              })}
            </div>
          </Section>

          <Section
            title="Component background"
            description="Set card and panel backgrounds across the app."
          >
            <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-12 gap-2">
              {componentColors.map((color) => {
                const isActive = selectedComponent === color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => applyComponent(color.value, color.border)}
                    title={color.name}
                    aria-label={color.name}
                    className={`rounded-md border transition-all p-1 ${
                      isActive
                        ? 'border-blue-400 ring-2 ring-blue-400/40'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded border"
                      style={{
                        backgroundColor: color.value,
                        borderColor: color.border,
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </Section>

          <Section
            title="Text color"
            description="Choose the default text color across the app."
          >
            <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-12 gap-2">
              {textColors.map((color) => {
                const isActive = selectedText === color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => applyText(color.value)}
                    title={color.name}
                    aria-label={color.name}
                    className={`rounded-md border transition-all p-1 ${
                      isActive
                        ? 'border-blue-400 ring-2 ring-blue-400/40'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded border border-black/20 flex items-center justify-center"
                      style={{ backgroundColor: '#0f172a' }}
                    >
                      <span
                        className="text-[10px] font-semibold"
                        style={{ color: color.value }}
                      >
                        Aa
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section
            title="Sidebar color"
            description="Update the sidebar background and divider color."
          >
            <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-12 gap-2">
              {sidebarColors.map((color) => {
                const isActive = selectedSidebar === color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => applySidebar(color.value, color.border)}
                    title={color.name}
                    aria-label={color.name}
                    className={`rounded-md border transition-all p-1 ${
                      isActive
                        ? 'border-blue-400 ring-2 ring-blue-400/40'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded border"
                      style={{
                        backgroundColor: color.value,
                        borderColor: color.border,
                      }}
                    />
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