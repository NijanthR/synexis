import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Sidebar from './components/SideBar'
import Dashboard from './pages/Dashboard'
import Models from './pages/Models'
import ModelDetail from './pages/ModelDetail'
import Datasets from './pages/Datasets'
import Predictions from './pages/Predictions'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ChatSidebar from './components/ChatSidebar'

function App() {
  const location = useLocation();
  const isLogin = location.pathname === '/login' || location.pathname === '/signup';
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(
      sessionStorage.getItem('authToken') ||
        sessionStorage.getItem('isAuthenticated') === 'true'
    )
  );
  const showShell = isAuthenticated && !isLogin;

  useEffect(() => {
    const syncAuth = () => {
      setIsAuthenticated(
        Boolean(
          sessionStorage.getItem('authToken') ||
            sessionStorage.getItem('isAuthenticated') === 'true'
        )
      );
    };

    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
    syncAuth();

    const handleStorage = (event) => {
      if (!event || event.key === 'authToken' || event.key === 'isAuthenticated') {
        syncAuth();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('auth-changed', syncAuth);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('auth-changed', syncAuth);
    };
  }, []);

  return (
    <div className="App app-text">
      <div className="flex h-screen">
        {showShell && <Sidebar />}
        <main className="flex-1 overflow-auto app-background">
          {/* Add responsive padding that accounts for sidebar */}
          <div className="h-full overflow-auto">
            <Routes>
              <Route
                path="/"
                element={
                  <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
                }
              />
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/models"
                element={isAuthenticated ? <Models /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/models/:modelId"
                element={
                  isAuthenticated ? <ModelDetail /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/datasets"
                element={
                  isAuthenticated ? <Datasets /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/predictions"
                element={
                  isAuthenticated ? <Predictions /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/settings"
                element={
                  isAuthenticated ? <Settings /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/profile"
                element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/login"
                element={
                  isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
                }
              />
              <Route
                path="/signup"
                element={
                  isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />
                }
              />
            </Routes>
          </div>
        </main>
      </div>
      {/* Add ChatSidebar component */}
      {showShell && <ChatSidebar />}
    </div>
  )
}

export default App