import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, BookOpen, Users } from 'lucide-react'
import { useData } from '../context/DataContext'

const features = [
  {
    icon: Sparkles,
    title: 'Curated Content',
    description: 'Handpicked resources from the best educators and platforms.',
  },
  {
    icon: BookOpen,
    title: 'Structured Learning',
    description: 'Follow a clear path from beginner to advanced topics.',
  },
  {
    icon: Users,
    title: 'Track Progress',
    description: 'Monitor your learning journey and earn certificates.',
  },
]

export default function Home() {
  const { courses, playlists, getCourseProgress } = useData()

  // Get 3 random courses for featured section
  const featuredCourses = [...courses]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)]/5 via-white to-[var(--primary)]/10 py-20 sm:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              Learn Smart,{' '}
              <span className="text-[var(--primary)]">Not Hard</span>
            </h1>
            <p className="mb-8 text-pretty text-lg text-[var(--muted-foreground)] sm:text-xl">
              Your curated learning platform for mastering programming and technology skills. Access quality resources, track your progress, and achieve your goals.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-8 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-[var(--primary)]/90 hover:shadow-xl"
              >
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/progress"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-8 py-3 text-sm font-medium text-[var(--foreground)] shadow-sm transition-all hover:bg-[var(--secondary)]"
              >
                Track Progress
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-[var(--primary)]">{courses.length}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Courses</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--primary)]">{playlists.length}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Playlists</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--primary)]">Free</p>
              <p className="text-sm text-[var(--muted-foreground)]">Forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4 rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-[var(--foreground)]">{feature.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="bg-[var(--secondary)]/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[var(--foreground)]">Featured Courses</h2>
            <p className="mx-auto max-w-2xl text-[var(--muted-foreground)]">
              Start your learning journey with our popular courses, carefully designed to help you succeed.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => {
              const coursePlaylistCount = playlists.filter(p => p.courseId === course.id).length
              const progress = getCourseProgress(course.id)
              
              return (
                <div
                  key={course.id}
                  className="group flex flex-col rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)]">
                    {course.name}
                  </h3>
                  <p className="mb-4 flex-grow text-sm text-[var(--muted-foreground)]">
                    {course.description}
                  </p>
                  <div className="mb-4 text-xs text-gray-500">
                    {coursePlaylistCount} playlists
                    {progress > 0 && <span className="ml-2 text-[var(--primary)]">({progress}% complete)</span>}
                  </div>
                  <Link
                    to={`/course/${course.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary)]/90"
                  >
                    View Course
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )
            })}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] transition-colors hover:text-[var(--primary)]/80"
            >
              View All Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[var(--primary)] p-8 text-center shadow-xl sm:p-12">
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
              Ready to Start Learning?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-[var(--primary-foreground)]/90">
              Join thousands of learners who are mastering new skills every day. Start your journey today!
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3 text-sm font-medium text-[var(--primary)] shadow-lg transition-all hover:bg-white/90"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
