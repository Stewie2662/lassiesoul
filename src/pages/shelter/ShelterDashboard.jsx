import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

export function ShelterDashboard() {
  const [shelter, setShelter] = useState(null)
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({})
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (user) {
      fetchShelterData()
    }
  }, [user])

  const fetchShelterData = async () => {
    try {
      const { data: shelterData, error: shelterErr } = await supabase
        .from('shelters')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (shelterErr) throw shelterErr
      setShelter(shelterData)
      setFormData(shelterData)

      const { data: animalsData, error: animalsErr } = await supabase
        .from('animals')
        .select('*')
        .eq('shelter_id', shelterData.id)

      if (animalsErr) throw animalsErr
      setAnimals(animalsData || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const { error: err } = await supabase
        .from('shelters')
        .update(formData)
        .eq('id', shelter.id)

      if (err) throw err
      setShelter(formData)
      setEditMode(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleDeleteAnimal = async (animalId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este animal?')) return

    try {
      const { error: err } = await supabase
        .from('animals')
        .delete()
        .eq('id', animalId)

      if (err) throw err
      setAnimals(animals.filter(a => a.id !== animalId))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Cargando...</div>

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{ backgroundColor: '#333', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <h1 style={{ margin: '0', fontSize: '24px' }}>LassieSoul</h1>
        </div>
        <div>
          <span style={{ marginRight: '2rem' }}>
            {user?.email}
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
        <h2 style={{ marginTop: '0' }}>Mi Protectora</h2>

        {error && <div style={{ backgroundColor: '#fee', color: '#c00', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>Error: {error}</div>}

        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0' }}>Información General</h3>
            {!editMode && (
              <button onClick={() => setEditMode(true)} style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Editar
              </button>
            )}
          </div>

          {editMode ? (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nombre</label>
                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Ciudad</label>
                <input type="text" value={formData.city || ''} onChange={(e) => setFormData({ ...formData, city: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Teléfono</label>
                <input type="text" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Descripción</label>
                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', minHeight: '100px' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={handleSave} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Guardar
                </button>
                <button onClick={() => { setFormData(shelter); setEditMode(false); }} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p><strong>Nombre:</strong> {shelter?.name || 'No especificado'}</p>
              <p><strong>Email:</strong> {shelter?.email}</p>
              <p><strong>Ciudad:</strong> {shelter?.city || 'No especificado'}</p>
              <p><strong>Teléfono:</strong> {shelter?.phone || 'No especificado'}</p>
              {shelter?.description && <p><strong>Descripción:</strong> {shelter.description}</p>}
            </div>
          )}
        </div>

        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0' }}>Mis Animales ({animals.length})</h3>
            <button
              onClick={() => navigate('/dashboard/shelter/animals/new')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Añadir Animal
            </button>
          </div>

          {animals.length === 0 ? (
            <p style={{ color: '#666' }}>No tienes animales registrados. ¡Añade uno!</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {animals.map((animal) => (
                <div key={animal.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
                  <h4 style={{ marginTop: '0' }}>{animal.name}</h4>
                  <p style={{ margin: '0.5rem 0', fontSize: '14px' }}>
                    <strong>Especie:</strong> {animal.species}
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '14px' }}>
                    <strong>Raza:</strong> {animal.breed || 'N/A'}
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '14px' }}>
                    <strong>Estado:</strong> {animal.status}
                  </p>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => navigate(`/dashboard/shelter/animals/${animal.id}`)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteAnimal(animal.id)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
