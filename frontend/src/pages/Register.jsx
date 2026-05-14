import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2, Shield, GraduationCap } from 'lucide-react'
import { useData } from '../context/DataContext'

const roleOptions = [
  { value: 'STUDENT', label: 'Student', icon: GraduationCap, description: 'Learn and track progress', color: 'border-blue-300 bg-blue-50 text-blue-700' },
  { value: 'TEACHER', label: 'Teacher', icon: BookOpen, description: 'Create courses and teach', color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
  { value: 'ADMIN', label: 'Admin', icon: Shield, description: 'Manage the platform', color: 'border-red-300 bg-red-50 text-red-700' },
]

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'STUDENT' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useData()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    })
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--background)] via-blue-50/30 to-violet-50/30 px-4 py-8">
      <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-[var(--primary)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="mb-6 text-center">
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
            <h1 className="mb-1 text-2xl font-bold text-[var(--foreground)]">Create Account</h1>
            <p className="mb-6 text-sm text-[var(--muted-foreground)]">Join SmartStudyHub and start learning today</p>

            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                      placeholder="Min 6 chars"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Confirm</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                      placeholder="Repeat"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)]"
              >
                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {showPassword ? 'Hide' : 'Show'} password
              </button>

              {/* Role Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">I am a...</label>
                <div className="grid grid-cols-3 gap-2">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, role: option.value }))}
                      className={`relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all ${
                        form.role === option.value
                          ? option.color + ' shadow-sm'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {form.role === option.value && (
                        <CheckCircle2 className="absolute right-1.5 top-1.5 h-3.5 w-3.5" />
                      )}
                      <option.icon className="h-5 w-5" />
                      <span className="text-xs font-semibold">{option.label}</span>
                    </button>
                  ))}
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
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[var(--primary)] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
