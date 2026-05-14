import { Link } from 'react-router-dom'
import { Library, BookOpen, Award, ArrowRight, CheckCircle2, PlayCircle } from 'lucide-react'
import { useData } from '../context/DataContext'
import ProgressBar from '../components/ProgressBar'

export default function MyLearning() {
  const { getEnrolledCourses, getCourseProgress, getCourseCompletedCount, getCourseTotalCount, certificates } = useData()
  const enrolled = getEnrolledCourses()
  const inProgress = enrolled.filter((c) => { const p = getCourseProgress(c.id); return p > 0 && p < 100 })
  const completed = enrolled.filter((c) => getCourseProgress(c.id) === 100)
  const notStarted = enrolled.filter((c) => getCourseProgress(c.id) === 0)

  const Section = ({ title, icon: Icon, courses, emptyMsg }) => (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-[var(--primary)]" />
        <h2 className="text-lg font-bold text-[var(--foreground)]">{title}</h2>
        <span className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--primary)]">{courses.length}</span>
      </div>
      {courses.length > 0 ? (
        <div className="space-y-3">
          {courses.map((course) => {
            const progress = getCourseProgress(course.id)
            const done = getCourseCompletedCount(course.id)
            const total = getCourseTotalCount(course.id)
            return (
              <Link key={course.id} to={`/course/${course.id}`} className="group flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${progress === 100 ? 'bg-emerald-50' : 'bg-[var(--primary)]/10'}`}>
                  {progress === 100 ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <BookOpen className="h-6 w-6 text-[var(--primary)]" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)]">{course.name}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--secondary)]">
                      <div className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)]'}`} style={{ width: `${progress}%` }} />
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-[var(--primary)]">{progress}%</span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">{done}/{total} videos completed</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-[var(--primary)]" />
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed bg-white px-6 py-8 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">{emptyMsg}</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[hsl(263,70%,58%)] shadow-lg shadow-[var(--primary)]/25">
              <Library className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">My Learning</h1>
              <p className="text-sm text-[var(--muted-foreground)]">{enrolled.length} courses enrolled</p>
            </div>
          </div>
        </div>

        <Section title="In Progress" icon={PlayCircle} courses={inProgress} emptyMsg="No courses in progress" />
        <Section title="Not Started" icon={BookOpen} courses={notStarted} emptyMsg="All enrolled courses have been started!" />
        <Section title="Completed" icon={CheckCircle2} courses={completed} emptyMsg="No completed courses yet" />

        {/* Certificates */}
        <div className="animate-fade-in-up">
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold text-[var(--foreground)]">Certificates</h2>
          </div>
          {certificates.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {certificates.map((cert) => (
                <div key={cert.id} className="group overflow-hidden rounded-2xl border bg-gradient-to-br from-amber-50 via-white to-amber-50/50 p-5 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100"><Award className="h-5 w-5 text-amber-600" /></div>
                    <div>
                      <h3 className="font-semibold text-[var(--foreground)]">{cert.courseName}</h3>
                      <p className="text-xs text-[var(--muted-foreground)]">Issued {new Date(cert.issuedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      <p className="mt-1 font-mono text-[10px] text-gray-400">{cert.certId}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-white px-6 py-8 text-center">
              <Award className="mx-auto mb-2 h-8 w-8 text-gray-300" />
              <p className="text-sm text-[var(--muted-foreground)]">Complete courses to earn certificates</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
