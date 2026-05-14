import { Link } from 'react-router-dom'
import { Users, BookOpen, PlayCircle, Flag, ArrowRight, Sparkles, Shield, TrendingUp, AlertTriangle } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function AdminDashboard() {
  const { currentUser, users, courses, playlists, reports, enrollments } = useData()

  const pendingReports = reports.filter((r) => r.status === 'pending').length
  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, bg: 'bg-blue-50', color: 'text-blue-600', gradient: 'from-blue-500 to-indigo-500' },
    { label: 'Total Courses', value: courses.length, icon: BookOpen, bg: 'bg-emerald-50', color: 'text-emerald-600', gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Total Videos', value: playlists.length, icon: PlayCircle, bg: 'bg-violet-50', color: 'text-violet-600', gradient: 'from-violet-500 to-purple-500' },
    { label: 'Pending Reports', value: pendingReports, icon: Flag, bg: pendingReports > 0 ? 'bg-red-50' : 'bg-gray-50', color: pendingReports > 0 ? 'text-red-600' : 'text-gray-600', gradient: 'from-red-500 to-pink-500' },
  ]

  const roleBreakdown = [
    { role: 'Students', count: users.filter((u) => u.role === 'STUDENT').length, color: 'bg-blue-500' },
    { role: 'Teachers', count: users.filter((u) => u.role === 'TEACHER').length, color: 'bg-emerald-500' },
    { role: 'Admins', count: users.filter((u) => u.role === 'ADMIN').length, color: 'bg-red-500' },
  ]

  const quickLinks = [
    { to: '/admin/users', label: 'Manage Users', icon: Users, desc: 'View and manage all users', color: 'bg-blue-50 text-blue-600' },
    { to: '/admin/courses', label: 'Manage Courses', icon: BookOpen, desc: 'Edit, delete, or feature courses', color: 'bg-emerald-50 text-emerald-600' },
    { to: '/admin/moderation', label: 'Content Moderation', icon: Flag, desc: `${pendingReports} reports pending review`, color: pendingReports > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600' },
  ]

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="animate-fade-in-up mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-rose-500 to-pink-500 p-6 shadow-xl shadow-red-500/20 sm:p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute right-6 top-6 hidden sm:block"><Shield className="h-8 w-8 text-white/30 animate-float" /></div>
            <div className="relative">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">Admin Panel</span>
              <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Welcome, {currentUser?.name} 👋</h1>
              <p className="mt-2 max-w-xl text-sm text-red-100/80">Monitor platform activity, manage users, and moderate content.</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
          {stats.map((s) => (
            <div key={s.label} className="group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg} transition-transform group-hover:scale-110`}><s.icon className={`h-6 w-6 ${s.color}`} /></div>
                <div><p className="text-2xl font-bold text-[var(--foreground)]">{s.value}</p><p className="text-sm text-[var(--muted-foreground)]">{s.label}</p></div>
              </div>
              <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${s.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Quick Actions</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map((l) => (
                <Link key={l.to} to={l.to} className="group flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${l.color} transition-transform group-hover:scale-110`}><l.icon className="h-5 w-5" /></div>
                  <div><p className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)]">{l.label}</p><p className="text-xs text-[var(--muted-foreground)]">{l.desc}</p></div>
                </Link>
              ))}
            </div>
          </div>

          {/* Role Breakdown */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">User Breakdown</h2>
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="space-y-4">
                {roleBreakdown.map((r) => (
                  <div key={r.role}>
                    <div className="mb-1.5 flex items-center justify-between text-sm"><span className="text-[var(--muted-foreground)]">{r.role}</span><span className="font-bold text-[var(--foreground)]">{r.count}</span></div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div className={`h-full rounded-full ${r.color} transition-all duration-500`} style={{ width: `${users.length > 0 ? (r.count / users.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t pt-4 text-center">
                <p className="text-2xl font-bold text-[var(--foreground)]">{users.length}</p>
                <p className="text-xs text-[var(--muted-foreground)]">Total Users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
