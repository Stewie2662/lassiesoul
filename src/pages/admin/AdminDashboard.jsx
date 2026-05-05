import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

export function AdminDashboard() {
  const [shelters, setShelters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const { data, error: err } = await supabase
          .from('shelters')
          .select('*')

        if (err) throw err
        setShelters(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchShelters()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleViewShelter = (shelterId) => {
    navigate(`/dashboard/admin/shelters/${shelterId}`)
  }

  const handleNewShelter = () => {
    navigate('/dashboard/admin/shelters/new')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{ backgroundColor: '#333', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <h1 style={{ margin: '0', fontSize: '24px' }}>LassieSoul - Admin</h1>
        </div>
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
      </nav>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: '0', fontSize: '28px' }}>Gestionar Protectoras</h2>
          <button
            onClick={handleNewShelter}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Nueva Protectora
          </button>
        </div>

        {loading && <p>Cargando protectoras...</p>}
        {error && <p style={{ color: '#dc3545' }}>Error: {error}</p>}

        {!loading && shelters.length === 0 && (
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
            <p>No hay protectoras registradas aún.</p>
          </div>
        )}

        {!loading && shelters.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {shelters.map((shelter) => (
              <div
                key={shelter.id}
                onClick={() => handleViewShelter(shelter.id)}
                style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <h3 style={{ marginTop: '0', marginBottom: '0.5rem' }}>{shelter.name || 'Sin nombre'}</h3>
                <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '14px' }}>
                  <strong>Ciudad:</strong> {shelter.city}
                </p>
                <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '14px' }}>
                  <strong>Email:</strong> {shelter.email}
                </p>
                {shelter.phone && (
                  <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '14px' }}>
                    <strong>Teléfono:</strong> {shelter.phone}
                  </p>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewShelter(shelter.id)
                  }}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
