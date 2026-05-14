import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, PlusCircle, Check, Clock, BarChart3, FileText, Tag } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function CreateCourse() {
  const { addCourse } = useData()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', description: '', level: 'Beginner', category: 'Programming', duration: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const categories = ['Programming', 'Computer Science', 'Web Development', 'Database', 'Data Science', 'DevOps', 'Mobile Development']

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const createdCourse = await addCourse({
      name: form.name.trim(),
      description: form.description.trim(),
      level: form.level,
      category: form.category,
      duration: form.duration.trim(),
    })

    setIsSubmitting(false)

    if (createdCourse) {
      setSuccess(true)
      setTimeout(() => navigate('/teacher/courses'), 1200)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-scale-in text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100"><Check className="h-8 w-8 text-emerald-600" /></div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">Course Created!</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Redirecting to your courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
              <PlusCircle className="h-6 w-6 text-white" />
            </div>
            <div><h1 className="text-2xl font-bold text-[var(--foreground)]">Create New Course</h1><p className="text-sm text-[var(--muted-foreground)]">Fill in the details to publish your course</p></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[var(--foreground)]"><BookOpen className="h-4 w-4 text-emerald-500" /> Course Title</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="e.g. Advanced JavaScript" required />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[var(--foreground)]"><FileText className="h-4 w-4 text-emerald-500" /> Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Describe what students will learn..." required />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[var(--foreground)]"><BarChart3 className="h-4 w-4 text-emerald-500" /> Level</label>
                <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none">
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[var(--foreground)]"><Tag className="h-4 w-4 text-emerald-500" /> Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[var(--foreground)]"><Clock className="h-4 w-4 text-emerald-500" /> Duration</label>
                <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none" placeholder="e.g. 10 hrs" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:brightness-110 disabled:opacity-60">
            {isSubmitting ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <><PlusCircle className="h-4 w-4" /> Create Course</>}
          </button>
        </form>
      </div>
    </div>
  )
}
