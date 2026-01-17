import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Models from './pages/Models'
import Datasets from './pages/Datasets'
import Predictions from './pages/Predictions'
import ApiAccess from './pages/ApiAccess'
import Settings from './pages/Settings'
import ChatSidebar from './components/ChatSidebar'

function App() {
  return (
    <div className="App">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50">
          {/* Add responsive padding that accounts for sidebar */}
          <div className="h-full overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/models" element={<Models />} />
              <Route path="/datasets" element={<Datasets />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/api-access" element={<ApiAccess />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
      {/* Add ChatSidebar component */}
      <ChatSidebar />
    </div>
  )
}

export default App