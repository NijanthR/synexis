import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/SideBar'
import Dashboard from './pages/Dashboard'
import Models from './pages/Models'
import ModelDetail from './pages/ModelDetail'
import Datasets from './pages/Datasets'
import Predictions from './pages/Predictions'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Login from './pages/Login'
import ChatSidebar from './components/ChatSidebar'

function App() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="App app-text">
      <div className="flex h-screen">
        {!isLogin && <Sidebar />}
        <main className="flex-1 overflow-auto app-background">
          {/* Add responsive padding that accounts for sidebar */}
          <div className="h-full overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/models" element={<Models />} />
              <Route path="/models/:modelId" element={<ModelDetail />} />
              <Route path="/datasets" element={<Datasets />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </main>
      </div>
      {/* Add ChatSidebar component */}
      {!isLogin && <ChatSidebar />}
    </div>
  )
}

export default App