import { useState, useEffect, useMemo } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  BookOpen, Menu, X, LayoutDashboard, GraduationCap, TrendingUp, User,
  LogOut, Shield, Users, Flag, PlusCircle, Library, Mail,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import { roleBadgeColors } from '../data/dummyData'

const studentLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/courses', label: 'Courses', icon: GraduationCap },
  { to: '/my-learning', label: 'My Learning', icon: Library },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/profile', label: 'Profile', icon: User },
]

const teacherLinks = [
  { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/teacher/courses', label: 'My Courses', icon: BookOpen },
  { to: '/teacher/create-course', label: 'Create Course', icon: PlusCircle },
  { to: '/courses', label: 'All Courses', icon: GraduationCap },
]

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/moderation', label: 'Moderation', icon: Flag },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, logout } = useData()

  useEffect(() => { setIsOpen(false) }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = useMemo(() => {
    if (!currentUser) return []
    if (currentUser.role === 'ADMIN') return adminLinks
    if (currentUser.role === 'TEACHER') return teacherLinks
    return studentLinks
  }, [currentUser])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  const badge = currentUser ? roleBadgeColors[currentUser.role] : null

  if (!currentUser) return null

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b bg-white/90 shadow-lg shadow-black/[0.03] backdrop-blur-xl'
          : 'border-b bg-white/95 backdrop-blur-sm'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink to="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[hsl(263,70%,58%)] shadow-md shadow-[var(--primary)]/25 transition-transform duration-300 group-hover:scale-105">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="gradient-text">Smart</span>
            <span className="text-[var(--foreground)]">StudyHub</span>
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
                }`
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right side: User info + Logout */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[hsl(263,70%,58%)] text-xs font-bold text-white">
              {getInitials(currentUser.name)}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[var(--foreground)] leading-tight">{currentUser.name}</p>
              {badge && (
                <span className={`inline-block rounded-sm px-1.5 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
                  {currentUser.role}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative rounded-xl p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] lg:hidden"
          aria-label="Toggle menu"
        >
          <div className="relative h-6 w-6">
            <Menu className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${isOpen ? 'rotate-90 scale-0 opacity-0' : ''}`} />
            <X className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${isOpen ? '' : '-rotate-90 scale-0 opacity-0'}`} />
          </div>
        </button>
      </nav>

      {/* Mobile Nav */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t bg-white px-4 py-3">
          {/* User info */}
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-[var(--secondary)]/50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[hsl(263,70%,58%)] text-sm font-bold text-white">
              {getInitials(currentUser.name)}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">{currentUser.name}</p>
              {badge && (
                <span className={`inline-block rounded-sm px-1.5 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
                  {currentUser.role}
                </span>
              )}
            </div>
          </div>

          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)] text-white shadow-lg shadow-[var(--primary)]/25'
                        : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)]'
                    }`
                  }
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
