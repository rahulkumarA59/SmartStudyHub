import { useState } from 'react'
import { Play, X } from 'lucide-react'
import VideoPlayer from './VideoPlayer'

const levelColors = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
}

export default function PlaylistCard({ playlist }) {
  const [showVideo, setShowVideo] = useState(false)
  const levelClassName = levelColors[playlist.level] ?? 'bg-slate-100 text-slate-700'

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-[var(--primary)]/10 p-4">
              <Play className="h-8 w-8 text-[var(--primary)]" />
            </div>
          </div>
          <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium ${levelClassName}`}>
            {playlist.level}
          </span>
        </div>

        <div className="p-4">
          <h3 className="mb-4 font-semibold text-[var(--foreground)]">{playlist.title}</h3>

          <div className="flex">
            <button
              onClick={() => setShowVideo(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary)]/90"
            >
              <Play className="h-4 w-4" />
              Play Video
            </button>
          </div>
        </div>
      </div>

      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-4xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -right-2 -top-12 rounded-lg p-2 text-white transition-colors hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="overflow-hidden rounded-xl bg-black shadow-2xl">
              <VideoPlayer youtubeUrl={playlist.youtubeUrl} />
            </div>
            <p className="mt-4 text-center text-white">{playlist.title}</p>
          </div>
        </div>
      )}
    </>
  )
}
