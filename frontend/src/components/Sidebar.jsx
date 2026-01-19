import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import spiderSvg from '../assets/spider.svg';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Models', icon: 'models', path: '/models' },
    { name: 'Datasets', icon: 'datasets', path: '/datasets' },
    { name: 'Predictions', icon: 'predictions', path: '/predictions' },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // SVG Icons
  const getIcon = (iconName, isActive = false) => {
    const iconColor = isActive ? 'text-white' : 'text-gray-400';
    const iconClass = `w-5 h-5 ${iconColor} flex-shrink-0 transition-colors duration-200`;

    switch (iconName) {
      case 'dashboard':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10" />
          </svg>
        );
      case 'models':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'datasets':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'predictions':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'api':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        );
      case 'settings':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`sidebar-background h-screen flex flex-col relative ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out`}>
      
      {/* Logo and Toggle Section */}
      <div className="p-4 border-b sidebar-border min-h-[80px] flex items-center justify-between relative">
        <div className="flex items-center min-w-0">
          {isCollapsed ? (
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              {/* Spider SVG - Collapsed State with white filter */}
              <img 
                src={spiderSvg} 
                alt="Synexis Logo" 
                className="w-6 h-6 filter brightness-0 invert"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              {/* Spider SVG - Expanded State with white filter */}
              <img 
                src={spiderSvg} 
                alt="Synexis Logo" 
                className="w-6 h-6 filter brightness-0 invert"
              />
              <h1 className="text-xl font-bold text-white whitespace-nowrap transition-opacity duration-300">
                Synexis
              </h1>
            </div>
          )}
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-200 flex-shrink-0"
        >
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              } ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}`}
              title={isCollapsed ? item.name : ''}
            >
              <div className="flex-shrink-0">
                {getIcon(item.icon, isActive(item.path))}
              </div>
              
              {!isCollapsed && (
                <span className="ml-3 whitespace-nowrap transition-opacity duration-200">
                  {item.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t sidebar-border">
        {/* Settings */}
        <div className="mb-3">
          <Link
            to="/settings"
            className={`flex items-center text-sm font-medium rounded-lg transition-all duration-200 ${
              isActive('/settings')
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            } ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}`}
            title={isCollapsed ? 'Settings' : ''}
          >
            <div className="flex-shrink-0">
              {getIcon('settings', isActive('/settings'))}
            </div>
            
            {!isCollapsed && (
              <span className="ml-3 whitespace-nowrap transition-opacity duration-200">
                Settings
              </span>
            )}
          </Link>
        </div>

        {/* User Profile */}
        <Link
          to="/profile"
          className={`flex items-center rounded-lg transition-all duration-200 ${
            isActive('/profile')
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          } ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}`}
          title={isCollapsed ? 'Profile' : ''}
        >
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          {!isCollapsed && (
            <div className="ml-3 flex-1 min-w-0 transition-all duration-200">
              <p className="text-sm font-medium truncate transition-opacity duration-200">
                John Doe
              </p>
              <p className="text-xs text-gray-500 truncate transition-opacity duration-200">
                john.doe@example.com
              </p>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;