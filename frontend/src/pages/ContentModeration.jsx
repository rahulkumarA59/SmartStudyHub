import { useState } from 'react'
import { Flag, CheckCircle2, XCircle, AlertTriangle, Play, Eye, Clock, User } from 'lucide-react'
import { useData } from '../context/DataContext'
import VideoPlayer from '../components/VideoPlayer'

export default function ContentModeration() {
  const { reports, playlists, users, courses, updateReportStatus, deletePlaylist } = useData()
  const [filter, setFilter] = useState('pending')
  const [previewVideo, setPreviewVideo] = useState(null)

  const filtered = filter === 'all' ? reports : reports.filter((r) => r.status === filter)

  const statusConfig = {
    pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
    approved: { label: 'Approved', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2 },
    removed: { label: 'Removed', bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
  }

  const handleApprove = (reportId) => { updateReportStatus(reportId, 'approved') }
  const handleRemove = (report) => {
    if (window.confirm('Remove this video and mark report as resolved?')) {
      updateReportStatus(report.id, 'removed')
      deletePlaylist(report.playlistId)
    }
  }

  const pendingCount = reports.filter((r) => r.status === 'pending').length

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 shadow-lg shadow-red-500/25"><Flag className="h-6 w-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)]">Content Moderation</h1>
              <p className="text-sm text-[var(--muted-foreground)]">{pendingCount} reports pending review</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          {[
            { value: 'pending', label: `Pending (${reports.filter((r) => r.status === 'pending').length})` },
            { value: 'approved', label: 'Approved' },
            { value: 'removed', label: 'Removed' },
            { value: 'all', label: 'All' },
          ].map((t) => (
            <button key={t.value} onClick={() => setFilter(t.value)}
              className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${filter === t.value ? 'bg-red-500 text-white shadow-md' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filtered.map((report) => {
            const video = playlists.find((p) => p.id === report.playlistId)
            const reporter = users.find((u) => u.id === report.reportedBy)
            const course = video ? courses.find((c) => c.id === video.courseId) : null
            const sc = statusConfig[report.status] || statusConfig.pending

            return (
              <div key={report.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md">
                <div className={`h-1 w-full ${report.status === 'pending' ? 'bg-amber-400' : report.status === 'approved' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <div className="p-5">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${sc.bg}`}><sc.icon className={`h-5 w-5 ${sc.text}`} /></div>
                      <div>
                        <h3 className="font-semibold text-[var(--foreground)]">{video?.title || 'Deleted Video'}</h3>
                        <p className="text-xs text-[var(--muted-foreground)]">{course?.name || 'Unknown Course'}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${sc.bg} ${sc.text}`}>{sc.label}</span>
                  </div>

                  {/* Reason */}
                  <div className="mb-4 rounded-xl bg-gray-50 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                      <AlertTriangle className="h-3 w-3" /> Reason
                    </div>
                    <p className="text-sm text-[var(--foreground)]">{report.reason}</p>
                  </div>

                  {/* Meta */}
                  <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> Reported by: {reporter?.name || 'Unknown'}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(report.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {video && (
                      <button onClick={() => setPreviewVideo(previewVideo === report.id ? null : report.id)} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
                        <Eye className="h-3.5 w-3.5" /> {previewVideo === report.id ? 'Hide Preview' : 'Preview Video'}
                      </button>
                    )}
                    {report.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(report.id)} className="flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve (Keep Video)
                        </button>
                        <button onClick={() => handleRemove(report)} className="flex items-center gap-1.5 rounded-xl bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-200">
                          <XCircle className="h-3.5 w-3.5" /> Remove Video
                        </button>
                      </>
                    )}
                  </div>

                  {/* Video Preview */}
                  {previewVideo === report.id && video && (
                    <div className="mt-4 overflow-hidden rounded-xl border">
                      <VideoPlayer youtubeUrl={video.youtubeUrl} />
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed bg-white px-6 py-12 text-center">
              <Flag className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="font-medium text-[var(--foreground)]">No {filter === 'all' ? '' : filter} reports</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{filter === 'pending' ? 'All caught up! No reports to review.' : 'No reports in this category.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
