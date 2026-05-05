import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Unauthorized } from './pages/Unauthorized'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { ShelterDetail } from './pages/admin/ShelterDetail'
import { ShelterDashboard } from './pages/shelter/ShelterDashboard'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin/shelters/:id"
        element={
          <ProtectedRoute requiredRole="admin">
            <ShelterDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/shelter"
        element={
          <ProtectedRoute requiredRole="shelter">
            <ShelterDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App