import { useContext } from 'react'
import { AuthContext } from '../lib/auth.jsx'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function useAuthenticatedUser() {
  const { user, role, loading } = useAuth()
  if (!loading && !user) {
    throw new Error('User must be authenticated to use this hook')
  }
  return { user, role, loading }
}

export function useRole(requiredRole) {
  const { role } = useAuth()
  return role === requiredRole
}
