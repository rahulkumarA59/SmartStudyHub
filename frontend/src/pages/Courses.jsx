import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, BookOpen, GraduationCap, SlidersHorizontal, Filter, Star, Users, Clock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { categoryColors, levelColors } from '../data/dummyData'
import { enrollCourse, getApiErrorMessage, getCourses, getMyCourses } from '../services/api'

export default function Courses() {
  const { currentUser, refreshData } = useData()
  const [courses, setCourses] = useState([])
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enrollingCourseId, setEnrollingCourseId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const loadCourses = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [courseData, myCourseData] = await Promise.all([
        getCourses(currentUser?.id),
        currentUser?.role === 'STUDENT' ? getMyCourses(currentUser.id) : Promise.resolve([]),
      ])

      setCourses(courseData)
      setEnrolledCourseIds(myCourseData.map((course) => course.id))
    } catch (loadError) {
      console.error('Failed to load courses:', loadError)
      setError(getApiErrorMessage(loadError, 'Unable to load courses right now.'))
      setCourses([])
      setEnrolledCourseIds([])
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  useEffect(() => {
    loadCourses()
  }, [loadCourses])

  const categories = useMemo(
    () => ['All', ...new Set(courses.map((course) => course.category).filter(Boolean))],
    [courses]
  )
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      const query = searchQuery.toLowerCase()
      const matchSearch = !query
        || course.name.toLowerCase().includes(query)
        || course.description?.toLowerCase().includes(query)
        || course.instructor?.toLowerCase().includes(query)
      const matchLevel = selectedLevel === 'All' || course.level === selectedLevel
      const matchCategory = selectedCategory === 'All' || course.category === selectedCategory
      return matchSearch && matchLevel && matchCategory
    })
  }, [courses, searchQuery, selectedLevel, selectedCategory])

  const handleEnroll = async (event, courseId) => {
    event.preventDefault()
    event.stopPropagation()

    if (!currentUser) return

    setEnrollingCourseId(courseId)
    setError('')

    try {
      await enrollCourse(courseId, currentUser.id, currentUser.id)
      await Promise.all([loadCourses(), refreshData()])
    } catch (enrollError) {
      console.error('Enrollment failed:', enrollError)
      setError(getApiErrorMessage(enrollError, 'Unable to enroll in this course right now.'))
    } finally {
      setEnrollingCourseId(null)
    }
  }

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[hsl(263,70%,58%)] shadow-lg shadow-[var(--primary)]/25">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-[var(--foreground)]">All Courses</h1>
              </div>
              <p className="text-[var(--muted-foreground)]">Explore our curated course catalog</p>
            </div>
            <span className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]"><BookOpen className="h-4 w-4" />{filtered.length} courses</span>
          </div>
        </div>

        <div className="mb-8 space-y-4 animate-fade-in-up">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              placeholder="Search courses by name, description, or instructor..."
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[var(--muted-foreground)]" />
              <div className="flex gap-1.5">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${selectedLevel === level ? 'bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)] text-white shadow-md' : 'border border-gray-200 bg-white text-[var(--muted-foreground)] hover:border-[var(--primary)]/30'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            {categories.length > 2 && (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[var(--muted-foreground)]" />
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${selectedCategory === category ? 'bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/20' : 'border border-gray-200 bg-white text-[var(--muted-foreground)] hover:border-[var(--primary)]/30'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary)]/20 border-t-[var(--primary)]" />
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">Loading courses...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {filtered.map((course, index) => {
              const enrolled = enrolledCourseIds.includes(course.id)
              const progress = enrolled ? course.progress : 0
              const totalVideos = course.playlists?.length || course.totalVideos || 0
              const colors = categoryColors[course.category] || { bg: 'bg-slate-100', text: 'text-slate-700' }
              const levelColor = levelColors[course.level] || { bg: 'bg-slate-100', text: 'text-slate-700' }

              return (
                <div key={course.id} className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl" style={{ animationDelay: `${index * 0.08}s` }}>
                  <div className="h-1.5 w-full bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)]" />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors.bg} transition-transform duration-300 group-hover:scale-110`}>
                        <BookOpen className={`h-5 w-5 ${colors.text}`} />
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${levelColor.bg} ${levelColor.text}`}>{course.level}</span>
                    </div>
                    <h3 className="mb-1 text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)]">{course.name}</h3>
                    <p className="mb-3 line-clamp-2 flex-grow text-sm text-[var(--muted-foreground)]">{course.description}</p>
                    <p className="mb-3 text-xs text-[var(--muted-foreground)]">by <span className="font-medium text-[var(--foreground)]">{course.instructor}</span></p>
                    <div className="mb-4 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                      {course.duration && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>}
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course.students || 0}</span>
                      <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{totalVideos}</span>
                      {course.rating > 0 && <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />{course.rating}</span>}
                    </div>

                    {enrolled ? (
                      <Link to={`/course/${course.id}`} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[var(--primary)]/20 transition-all hover:shadow-lg hover:brightness-110">
                        {progress > 0 ? 'Continue Learning' : 'Start Learning'} <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : currentUser?.role === 'STUDENT' ? (
                      <button
                        onClick={(event) => handleEnroll(event, course.id)}
                        disabled={enrollingCourseId === course.id}
                        className="flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary)] transition-all hover:bg-[var(--primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {enrollingCourseId === course.id ? 'Enrolling...' : 'Enroll Now'}
                      </button>
                    ) : (
                      <Link to={`/course/${course.id}`} className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200">
                        View Course <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-white px-6 py-16 text-center shadow-sm">
            <Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-lg font-medium text-[var(--foreground)]">No courses match your search</p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
