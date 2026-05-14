import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { addCourse as createCourse, getApiErrorMessage } from '../services/api'

const initialFormState = {
  name: '',
  description: '',
}

export default function AddCourseModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setForm(initialFormState)
      setIsSubmitting(false)
      setError('')
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.description.trim()) {
      return
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
    }

    setIsSubmitting(true)
    setError('')

    try {
      const createdCourse = onSubmit
        ? await onSubmit(payload)
        : await createCourse(payload)

      if (!onSubmit) {
        window.dispatchEvent(new Event('courses:refresh'))
      }

      setForm(initialFormState)
      handleClose()
      return createdCourse
    } catch (submitError) {
      console.error('Failed to add course:', submitError)
      setError(getApiErrorMessage(submitError, 'Unable to add the course right now. Please try again.'))
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 rounded-xl bg-white p-6 shadow-xl">
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
          Add New Course
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="courseName"
              className="mb-1 block text-sm font-medium text-[var(--foreground)]"
            >
              Course Name
            </label>
            <input
              id="courseName"
              type="text"
              value={form.name}
              onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="Enter course name"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label
              htmlFor="courseDescription"
              className="mb-1 block text-sm font-medium text-[var(--foreground)]"
            >
              Course Description
            </label>
            <textarea
              id="courseDescription"
              value={form.description}
              onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="Enter course description"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary)]/90"
            >
              {isSubmitting ? 'Adding...' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
