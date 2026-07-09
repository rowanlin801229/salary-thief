import { Navigate, useLocation } from 'react-router-dom'
import { useAppState } from '../context/AppStateContext'
import { useAuth } from '../context/AuthContext'
import { isScheduleComplete } from '../lib/salary'
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
    return <Navigate to="/setup-profile" replace state={{ from: location.pathname }} />
  }

  return children
}

export function GuestRoute({ children }: { children: ReactNode }) {
  const { user, loading, profileComplete } = useAuth()
  const { salaryConfig } = useAppState()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  if (loading) {
    return (
      <main className="auth-page">
        <p className="auth-loading">Loading…</p>
      </main>
    )
  }

  if (user && !profileComplete) {
    if (location.pathname === '/setup-profile') {
      return children
    }
    return <Navigate to="/setup-profile" replace state={{ from }} />
  }

  if (user && profileComplete) {
    const hasSalary = salaryConfig.amount > 0 && isScheduleComplete(salaryConfig)
    if (!hasSalary) {
      return <Navigate to="/setup" replace />
    }
    if (from) {
      return <Navigate to={from} replace />
    }
    return <Navigate to="/result" replace />
  }

  return children
}
