import { Link } from 'react-router-dom'
import {
  BookOpen, PlayCircle, TrendingUp, Clock, ArrowRight, Sparkles,
  CheckCircle2, Flame, Star, Library,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import CourseCard from '../components/CourseCard'

export default function Dashboard() {
  const {
    currentUser, courses, playlists, completedPlaylists, recentActivity,
    getCourseProgress, getOverallProgress, getTotalCompletedVideos,
    getEnrolledCourses, getCourseCompletedCount, getCourseTotalCount,
  } = useData()

  const enrolledCourses = getEnrolledCourses()
  const overallProgress = getOverallProgress()
  const totalCompleted = getTotalCompletedVideos()

  const getRelativeTime = (ts) => {
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const stats = [
    { label: 'Courses Enrolled', value: enrolledCourses.length, icon: BookOpen, gradient: 'from-blue-500 to-indigo-500', bgLight: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Videos Completed', value: totalCompleted, icon: PlayCircle, gradient: 'from-emerald-500 to-teal-500', bgLight: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { label: 'Overall Progress', value: `${overallProgress}%`, icon: TrendingUp, gradient: 'from-violet-500 to-purple-500', bgLight: 'bg-violet-50', textColor: 'text-violet-600' },
  ]

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Welcome */}
        <div className="animate-fade-in-up mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary)] via-[hsl(230,80%,55%)] to-[hsl(263,70%,58%)] p-6 shadow-xl shadow-[var(--primary)]/20 sm:p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />
            <div className="absolute right-6 top-6 hidden sm:block">
              <Sparkles className="h-8 w-8 text-yellow-300/60 animate-float" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 text-blue-200">
                <Flame className="h-5 w-5 text-orange-300" />
                <span className="text-sm font-medium">Keep up the momentum!</span>
              </div>
              <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                Welcome back, {currentUser?.name?.split(' ')[0]} 👋
              </h1>
              <p className="mt-2 max-w-xl text-sm text-blue-100/80 sm:text-base">
                You've completed <span className="font-semibold text-white">{totalCompleted} videos</span> so far.
                Continue your learning journey and unlock new skills today.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3 stagger-children">
          {stats.map((stat) => (
            <div key={stat.label} className="group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgLight} transition-transform duration-300 group-hover:scale-110`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{stat.label}</p>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${stat.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
            </div>
          ))}
        </div>

        {/* Course Progress */}
        <div className="mb-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">Course Progress</h2>
              <p className="text-sm text-[var(--muted-foreground)]">Continue where you left off</p>
            </div>
            <Link to="/courses" className="flex items-center gap-1 text-sm font-semibold text-[var(--primary)] hover:underline">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {enrolledCourses.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
              {enrolledCourses.slice(0, 6).map((course, i) => (
                <CourseCard key={course.id} course={course} progress={getCourseProgress(course.id)} playlistCount={getCourseTotalCount(course.id)} completedCount={getCourseCompletedCount(course.id)} index={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-white px-6 py-12 text-center">
              <Library className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="font-medium text-[var(--foreground)]">No enrolled courses yet</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">Browse courses to get started!</p>
              <Link to="/courses" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white">Browse Courses</Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="animate-fade-in-up">
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Recent Activity</h2>
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            {recentActivity.length > 0 ? (
              <ul className="divide-y">
                {recentActivity.slice(0, 5).map((activity) => {
                  const playlist = playlists.find((p) => p.id === activity.playlistId)
                  const course = courses.find((c) => c.id === activity.courseId)
                  const cfg = { Completed: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' }, Watched: { icon: PlayCircle, color: 'text-blue-500', bg: 'bg-blue-50' }, Started: { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' } }
                  const c = cfg[activity.action] || cfg.Watched
                  return (
                    <li key={activity.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.bg}`}><c.icon className={`h-5 w-5 ${c.color}`} /></div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--foreground)]">{activity.action}: {playlist?.title || 'Video'}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{course?.name || 'Course'}</p>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]"><Clock className="h-3 w-3" />{getRelativeTime(activity.timestamp)}</span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="px-5 py-12 text-center"><Clock className="mx-auto mb-3 h-10 w-10 text-gray-300" /><p className="text-sm text-[var(--muted-foreground)]">No recent activity yet</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
