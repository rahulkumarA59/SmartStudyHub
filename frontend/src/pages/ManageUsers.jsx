import { useState, useMemo } from 'react'
import { Users, Search, Shield, GraduationCap, BookOpen, Trash2, ChevronDown } from 'lucide-react'
import { useData } from '../context/DataContext'
import { roleBadgeColors } from '../data/dummyData'

export default function ManageUsers() {
  const { users, currentUser, updateUserRole, deleteUser } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase()
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      const matchRole = roleFilter === 'All' || u.role === roleFilter
      return matchSearch && matchRole
    })
  }, [users, searchQuery, roleFilter])

  const roleIcon = { STUDENT: GraduationCap, TEACHER: BookOpen, ADMIN: Shield }

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 shadow-lg shadow-red-500/25"><Users className="h-6 w-6 text-white" /></div>
            <div><h1 className="text-2xl font-bold text-[var(--foreground)]">Manage Users</h1><p className="text-sm text-[var(--muted-foreground)]">{users.length} total users</p></div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" placeholder="Search users..." />
          </div>
          <div className="flex gap-1.5">
            {['All', 'STUDENT', 'TEACHER', 'ADMIN'].map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`rounded-xl px-3 py-2 text-xs font-medium transition-all ${roleFilter === r ? 'bg-red-500 text-white shadow-md' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                {r === 'All' ? 'All' : r.charAt(0) + r.slice(1).toLowerCase()}s
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/80">
                  <th className="px-5 py-3.5 text-left font-semibold text-[var(--foreground)]">User</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-[var(--foreground)]">Email</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-[var(--foreground)]">Role</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-[var(--foreground)]">Joined</th>
                  <th className="px-5 py-3.5 text-right font-semibold text-[var(--foreground)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((user) => {
                  const badge = roleBadgeColors[user.role]
                  const Icon = roleIcon[user.role] || GraduationCap
                  const isSelf = user.id === currentUser?.id
                  return (
                    <tr key={user.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[hsl(263,70%,58%)] text-xs font-bold text-white">
                            {user.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-medium text-[var(--foreground)]">{user.name} {isSelf && <span className="text-xs text-[var(--muted-foreground)]">(you)</span>}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[var(--muted-foreground)]">{user.email}</td>
                      <td className="px-5 py-3.5">
                        <div className="relative inline-block">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value)}
                            disabled={isSelf}
                            className={`appearance-none rounded-lg px-3 py-1.5 pr-7 text-xs font-semibold ${badge?.bg} ${badge?.text} ${isSelf ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} border-0 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20`}
                          >
                            <option value="STUDENT">Student</option>
                            <option value="TEACHER">Teacher</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                          {!isSelf && <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 opacity-60" />}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[var(--muted-foreground)]">{user.joinedDate ? new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}</td>
                      <td className="px-5 py-3.5 text-right">
                        {!isSelf && (
                          <button onClick={() => { if (window.confirm(`Delete user "${user.name}"?`)) deleteUser(user.id) }} className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center"><Users className="mx-auto mb-3 h-10 w-10 text-gray-300" /><p className="text-sm text-[var(--muted-foreground)]">No users found</p></div>
          )}
        </div>
      </div>
    </div>
  )
}
