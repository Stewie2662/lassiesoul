import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Dashboard() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleNavigate = (path) => {
    navigate(path)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{ backgroundColor: '#333', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: '0', fontSize: '24px' }}>LassieSoul</h1>
        <div>
          <span style={{ marginRight: '2rem' }}>
            {user?.email} ({role})
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {role === 'admin' && (
          <div>
            <h2 style={{ fontSize: '28px', marginBottom: '2rem' }}>Panel de Administrador</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }} onClick={() => handleNavigate('/dashboard/admin')}>
                <h3 style={{ marginTop: '0' }}>Gestionar Protectoras</h3>
                <p style={{ color: '#666' }}>Ver todas las protectoras registradas y gestionar sus datos</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginTop: '0' }}>Todos los Animales</h3>
                <p style={{ color: '#666' }}>Ver animales de todas las protectoras</p>
              </div>
            </div>
          </div>
        )}

        {role === 'shelter' && (
          <div>
            <h2 style={{ fontSize: '28px', marginBottom: '2rem' }}>Panel de Protectora</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }} onClick={() => handleNavigate('/dashboard/shelter')}>
                <h3 style={{ marginTop: '0' }}>Mi Perfil</h3>
                <p style={{ color: '#666' }}>Ver y editar información de tu protectora</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }} onClick={() => handleNavigate('/dashboard/shelter')}>
                <h3 style={{ marginTop: '0' }}>Mis Animales</h3>
                <p style={{ color: '#666' }}>Gestionar animales en adopción</p>
              </div>
            </div>
          </div>
        )}

        {role === 'adopter' && (
          <div>
            <h2 style={{ fontSize: '28px', marginBottom: '2rem' }}>Portal Público</h2>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <p style={{ color: '#666', fontSize: '16px' }}>El portal público de adopción estará disponible pronto.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
