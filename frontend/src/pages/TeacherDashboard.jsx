import { Link } from 'react-router-dom'
import { BookOpen, Users, PlayCircle, PlusCircle, ArrowRight, TrendingUp, BarChart3, Sparkles } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function TeacherDashboard() {
  const { currentUser, getTeacherCourses, getTeacherStudentCount, getTeacherVideoCount, playlists } = useData()
  const teacherCourses = getTeacherCourses()
  const studentCount = getTeacherStudentCount()
  const videoCount = getTeacherVideoCount()

  const stats = [
    { label: 'My Courses', value: teacherCourses.length, icon: BookOpen, bg: 'bg-blue-50', color: 'text-blue-600', gradient: 'from-blue-500 to-indigo-500' },
    { label: 'Total Students', value: studentCount, icon: Users, bg: 'bg-emerald-50', color: 'text-emerald-600', gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Total Videos', value: videoCount, icon: PlayCircle, bg: 'bg-violet-50', color: 'text-violet-600', gradient: 'from-violet-500 to-purple-500' },
  ]

  const quickActions = [
    { to: '/teacher/create-course', label: 'Create New Course', icon: PlusCircle, desc: 'Design and publish a course' },
    { to: '/teacher/courses', label: 'Manage Courses', icon: BookOpen, desc: 'Edit or update your courses' },
  ]

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Welcome */}
        <div className="animate-fade-in-up mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 shadow-xl shadow-emerald-500/20 sm:p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute right-6 top-6 hidden sm:block"><Sparkles className="h-8 w-8 text-yellow-300/60 animate-float" /></div>
            <div className="relative">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">Teacher Panel</span>
              <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Welcome, {currentUser?.name} 👋</h1>
              <p className="mt-2 max-w-xl text-sm text-emerald-100/80">Manage your courses, add content, and track student engagement.</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3 stagger-children">
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

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {quickActions.map((a) => (
              <Link key={a.to} to={a.to} className="group flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 transition-transform group-hover:scale-110"><a.icon className="h-6 w-6 text-emerald-600" /></div>
                <div className="flex-1"><p className="font-semibold text-[var(--foreground)] group-hover:text-emerald-600">{a.label}</p><p className="text-sm text-[var(--muted-foreground)]">{a.desc}</p></div>
                <ArrowRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" />
              </Link>
            ))}
          </div>
        </div>

        {/* My Courses Summary */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--foreground)]">My Courses</h2>
            <Link to="/teacher/courses" className="text-sm font-semibold text-emerald-600 hover:underline">View All</Link>
          </div>
          {teacherCourses.length > 0 ? (
            <div className="space-y-3">
              {teacherCourses.slice(0, 4).map((c) => {
                const vids = playlists.filter((p) => p.courseId === c.id).length
                return (
                  <div key={c.id} className="flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50"><BookOpen className="h-5 w-5 text-emerald-600" /></div>
                    <div className="min-w-0 flex-1"><p className="truncate font-semibold text-[var(--foreground)]">{c.name}</p><p className="text-xs text-[var(--muted-foreground)]">{vids} videos · {c.students || 0} students</p></div>
                    <Link to={`/course/${c.id}`} className="text-sm font-medium text-emerald-600 hover:underline">View</Link>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-white px-6 py-10 text-center">
              <BookOpen className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="font-medium text-[var(--foreground)]">No courses yet</p>
              <Link to="/teacher/create-course" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                <PlusCircle className="h-4 w-4" /> Create Your First Course
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
