import { useState, useMemo } from 'react'
import { BookOpen, Search, Trash2, Star, StarOff, Users, PlayCircle } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function ManageCourses() {
  const { courses, playlists, updateCourse, deleteCourse } = useData()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return courses.filter((c) => !q || c.name.toLowerCase().includes(q) || c.instructor?.toLowerCase().includes(q))
  }, [courses, searchQuery])

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 shadow-lg shadow-red-500/25"><BookOpen className="h-6 w-6 text-white" /></div>
            <div><h1 className="text-2xl font-bold text-[var(--foreground)]">Manage Courses</h1><p className="text-sm text-[var(--muted-foreground)]">{courses.length} total courses</p></div>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" placeholder="Search courses..." />
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/80">
                  <th className="px-5 py-3.5 text-left font-semibold text-[var(--foreground)]">Course</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-[var(--foreground)]">Instructor</th>
                  <th className="px-5 py-3.5 text-center font-semibold text-[var(--foreground)]">Videos</th>
                  <th className="px-5 py-3.5 text-center font-semibold text-[var(--foreground)]">Students</th>
                  <th className="px-5 py-3.5 text-center font-semibold text-[var(--foreground)]">Featured</th>
                  <th className="px-5 py-3.5 text-right font-semibold text-[var(--foreground)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((course) => {
                  const vids = playlists.filter((p) => p.courseId === course.id).length
                  const students = course.students || 0
                  return (
                    <tr key={course.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10"><BookOpen className="h-4 w-4 text-[var(--primary)]" /></div>
                          <div><p className="font-medium text-[var(--foreground)]">{course.name}</p><p className="text-xs text-[var(--muted-foreground)]">{course.level} · {course.category}</p></div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[var(--muted-foreground)]">{course.instructor || '—'}</td>
                      <td className="px-5 py-3.5 text-center"><span className="inline-flex items-center gap-1 text-[var(--muted-foreground)]"><PlayCircle className="h-3.5 w-3.5" />{vids}</span></td>
                      <td className="px-5 py-3.5 text-center"><span className="inline-flex items-center gap-1 text-[var(--muted-foreground)]"><Users className="h-3.5 w-3.5" />{students}</span></td>
                      <td className="px-5 py-3.5 text-center">
                        <button onClick={async () => { await updateCourse(course.id, { featured: !course.featured }) }} className={`rounded-lg p-2 transition-colors ${course.featured ? 'bg-amber-50 text-amber-500 hover:bg-amber-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                          {course.featured ? <Star className="h-4 w-4" fill="currentColor" /> : <StarOff className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button onClick={async () => { if (window.confirm(`Delete "${course.name}"?`)) await deleteCourse(course.id) }} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center"><BookOpen className="mx-auto mb-3 h-10 w-10 text-gray-300" /><p className="text-sm text-[var(--muted-foreground)]">No courses found</p></div>
          )}
        </div>
      </div>
    </div>
  )
}
