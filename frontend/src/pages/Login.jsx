import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useData()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)
    setIsLoading(false)

    if (result.success) {
      const role = result.user.role
      if (role === 'ADMIN') navigate('/admin/dashboard')
      else if (role === 'TEACHER') navigate('/teacher/dashboard')
      else navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--background)] via-blue-50/30 to-violet-50/30 px-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-[var(--primary)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[hsl(263,70%,58%)] shadow-lg shadow-[var(--primary)]/25">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="gradient-text">Smart</span>
              <span className="text-[var(--foreground)]">StudyHub</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-xl shadow-black/[0.04]">
          <div className="h-1.5 w-full bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)]" />
          <div className="p-7">
            <h1 className="mb-1 text-2xl font-bold text-[var(--foreground)]">Welcome Back</h1>
            <p className="mb-6 text-sm text-[var(--muted-foreground)]">Sign in to continue your learning journey</p>

            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-11 text-sm transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)] py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/25 transition-all hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-[var(--primary)] hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        {/*<div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-white/60 p-4">*/}
        {/*  <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">*/}
        {/*    Demo Credentials*/}
        {/*  </p>*/}
        {/*  <div className="grid gap-1.5 text-xs text-gray-500">*/}
        {/*    <div className="flex items-center justify-between rounded-lg bg-blue-50/70 px-3 py-1.5">*/}
        {/*      <span className="font-medium text-blue-700">Student</span>*/}
        {/*      <span className="font-mono">student@smartstudyhub.com / student123</span>*/}
        {/*    </div>*/}
        {/*    <div className="flex items-center justify-between rounded-lg bg-emerald-50/70 px-3 py-1.5">*/}
        {/*      <span className="font-medium text-emerald-700">Teacher</span>*/}
        {/*      <span className="font-mono">teacher@smartstudyhub.com / teacher123</span>*/}
        {/*    </div>*/}
        {/*    <div className="flex items-center justify-between rounded-lg bg-red-50/70 px-3 py-1.5">*/}
        {/*      <span className="font-medium text-red-700">Admin</span>*/}
        {/*      <span className="font-mono">admin@smartstudyhub.com / admin123</span>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  )
}
