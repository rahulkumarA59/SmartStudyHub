import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { Lock, Mail, AlertCircle, Shield } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isAdmin } = useData()
  const navigate = useNavigate()

  // If already logged in, redirect to admin panel
  if (isAdmin) {
    navigate('/admin/panel')
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (login(email, password)) {
      navigate('/admin/panel')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border-2 border-red-200 bg-white p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter your credentials to access the admin panel
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  placeholder="admin@smartstudyhub.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[var(--primary)] py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--primary)]/90"
            >
              Sign In
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <p className="text-center text-xs text-gray-500">
              Demo credentials: <br />
              <span className="font-mono">admin@smartstudyhub.com</span> / <span className="font-mono">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
