import { CheckCircle2, SkipForward, MonitorPlay } from 'lucide-react'

function getEmbedUrl(url) {
  if (!url) return ''

  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname.replace('www.', '')

    if (hostname === 'youtu.be') {
      const videoId = parsedUrl.pathname.slice(1)
      return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
    }

    if (!hostname.endsWith('youtube.com')) return ''

    if (parsedUrl.pathname === '/watch') {
      const videoId = parsedUrl.searchParams.get('v')
      return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
    }

    const pathParts = parsedUrl.pathname.split('/').filter(Boolean)
    const [, videoId] = pathParts

    if (['embed', 'shorts', 'live'].includes(pathParts[0]) && videoId) {
      return `https://www.youtube.com/embed/${videoId}`
    }

    return ''
  } catch {
    return ''
  }
}

export default function VideoPlayer({
  youtubeUrl,
  title = '',
  isCompleted = false,
  onMarkComplete,
  onNextVideo,
  hasNext = false,
}) {
  const embedUrl = getEmbedUrl(youtubeUrl)

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* Video Frame */}
      {embedUrl ? (
        <div className="aspect-video bg-black">
          <iframe
            src={embedUrl}
            title={title || 'YouTube video player'}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <MonitorPlay className="h-16 w-16" />
            <p className="text-sm font-medium">Select a video to start learning</p>
          </div>
        </div>
      )}

      {/* Video Info & Controls */}
      <div className="p-5">
        {title && (
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">{title}</h2>
        )}
        <div className="flex flex-wrap items-center gap-3">
          {onMarkComplete && (
            <button
              onClick={onMarkComplete}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  : 'bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)] text-white shadow-md shadow-[var(--primary)]/20 hover:shadow-lg hover:brightness-110'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {isCompleted ? 'Completed ✓' : 'Mark Complete'}
            </button>
          )}

          {hasNext && onNextVideo && (
            <button
              onClick={onNextVideo}
              className="flex items-center gap-2 rounded-xl border-2 border-[var(--primary)]/20 bg-[var(--primary)]/5 px-5 py-2.5 text-sm font-semibold text-[var(--primary)] transition-all duration-300 hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/10"
            >
              Next Video
              <SkipForward className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
