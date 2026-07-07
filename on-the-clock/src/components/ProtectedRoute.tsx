import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requireProfile?: boolean
}

export function ProtectedRoute({ children, requireProfile = true }: ProtectedRouteProps) {
  const { user, loading, profileComplete } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <main className="auth-page">
        <p className="auth-loading">Loading…</p>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  }

  if (requireProfile && !profileComplete) {
    return <Navigate to="/setup-profile" replace />
  }

  return children
}

export function GuestRoute({ children }: { children: ReactNode }) {
  const { user, loading, profileComplete } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  if (loading) {
    return (
      <main className="auth-page">
        <p className="auth-loading">Loading…</p>
      </main>
    )
  }

  if (user && profileComplete) {
    return <Navigate to={from ?? '/result'} replace />
  }

  if (user && !profileComplete && location.pathname !== '/setup-profile') {
    return <Navigate to="/setup-profile" replace />
  }

  return children
}
