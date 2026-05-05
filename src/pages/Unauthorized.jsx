import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Unauthorized() {
  const navigate = useNavigate()
  const { role } = useAuth()

  const dashboardUrl = role === 'admin' ? '/dashboard/admin' : '/dashboard/shelter'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '48px', color: '#dc3545', marginBottom: '1rem' }}>403</h1>
        <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '1rem' }}>Acceso No Autorizado</h2>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '16px' }}>
          No tienes permisos para acceder a esta página.
        </p>
        <button
          onClick={() => navigate(dashboardUrl)}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  )
}
