import { useEffect, useState } from 'react'
import { X, PlayCircle } from 'lucide-react'

const initialFormState = {
  title: '',
  youtubeUrl: '',
  level: 'Beginner',
  duration: '',
}

export default function AddPlaylistModal({ isOpen, onClose, courseId, onSubmit }) {
  const [form, setForm] = useState(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleClose = () => {
    if (!isSubmitting) onClose()
  }

  useEffect(() => {
    if (!isOpen) {
      setForm(initialFormState)
      setIsSubmitting(false)
      setError('')
    }
  }, [isOpen])

  // Generate embed preview URL
  const getEmbedUrl = (url) => {
    if (!url) return ''
    try {
      const parsed = new URL(url)
      const host = parsed.hostname.replace('www.', '')
      if (host === 'youtu.be') return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`
      if (host === 'youtube.com' && parsed.pathname === '/watch') {
        const v = parsed.searchParams.get('v')
        return v ? `https://www.youtube.com/embed/${v}` : ''
      }
      return ''
    } catch { return '' }
  }

  const previewUrl = getEmbedUrl(form.youtubeUrl)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.youtubeUrl.trim()) return

    const payload = { courseId, title: form.title.trim(), youtubeUrl: form.youtubeUrl.trim(), level: form.level, duration: form.duration.trim() }

    setIsSubmitting(true)
    setError('')

    try {
      await onSubmit(payload)
      setForm(initialFormState)
      handleClose()
    } catch (err) {
      setError('Unable to add the video. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg animate-scale-in overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)]" />
        <div className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10">
                <PlayCircle className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">Add Video</h2>
            </div>
            <button onClick={handleClose} disabled={isSubmitting} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Video Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                placeholder="Enter video title" disabled={isSubmitting} required />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">YouTube URL</label>
              <input type="url" value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                placeholder="https://www.youtube.com/watch?v=..." disabled={isSubmitting} required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Level</label>
                <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none" disabled={isSubmitting}>
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Duration</label>
                <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none"
                  placeholder="e.g. 1 hr 30 min" disabled={isSubmitting} />
              </div>
            </div>

            {/* Video Preview */}
            {previewUrl && (
              <div className="overflow-hidden rounded-xl border">
                <div className="aspect-video">
                  <iframe src={previewUrl} title="Preview" className="h-full w-full" allowFullScreen />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleClose} disabled={isSubmitting}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={isSubmitting}
                className="flex-1 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110 disabled:opacity-60">
                {isSubmitting ? 'Adding...' : 'Add Video'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
