import { Navigate } from 'react-router-dom'
import { useData } from '../context/DataContext'

function AuthScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primary)]/20 border-t-[var(--primary)]" />
    </div>
  )
}

// Protects routes that require authentication
export function ProtectedRoute({ children }) {
  const { currentUser, authLoading } = useData()

  if (authLoading) {
    return <AuthScreenLoader />
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Protects routes that require specific roles
export function RoleBasedGuard({ children, allowedRoles = [] }) {
  const { currentUser, authLoading } = useData()

  if (authLoading) {
    return <AuthScreenLoader />
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on role
    if (currentUser.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />
    if (currentUser.role === 'TEACHER') return <Navigate to="/teacher/dashboard" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Redirects logged-in users away from auth pages
export function GuestRoute({ children }) {
  const { currentUser, authLoading } = useData()

  if (authLoading) {
    return <AuthScreenLoader />
  }

  if (currentUser) {
    if (currentUser.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />
    if (currentUser.role === 'TEACHER') return <Navigate to="/teacher/dashboard" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}
