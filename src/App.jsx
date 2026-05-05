import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      setConnected(true)
    })
  }, [])

  return (
    <div>
      <h1>LassieSoul</h1>
      <p>{connected ? 'Conectado a Supabase' : 'Conectando...'}</p>
    </div>
  )
}

export default App