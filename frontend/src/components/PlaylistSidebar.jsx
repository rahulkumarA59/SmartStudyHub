import { Play, CheckCircle2, Circle, Clock } from 'lucide-react'

export default function PlaylistSidebar({
  playlists = [],
  activeVideoId,
  completedIds = [],
  onVideoSelect,
  courseName = '',
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-[var(--primary)]/5 to-[hsl(263,70%,58%)]/5 px-5 py-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
          Playlist
        </h3>
        {courseName && (
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{courseName}</p>
        )}
        <div className="mt-2 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <span>{completedIds.length}/{playlists.length} completed</span>
          <span className="text-[var(--border)]">•</span>
          <span>{Math.round((completedIds.length / Math.max(playlists.length, 1)) * 100)}%</span>
        </div>
      </div>

      {/* Video List */}
      <div className="flex-1 overflow-y-auto">
        <ul className="py-1">
          {playlists.map((video, index) => {
            const isActive = video.id === activeVideoId
            const isCompleted = completedIds.includes(video.id)

            return (
              <li key={video.id}>
                <button
                  onClick={() => onVideoSelect(video)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-all duration-200 ${
                    isActive
                      ? 'border-l-3 border-l-[var(--primary)] bg-[var(--primary)]/[0.08]'
                      : 'hover:bg-[var(--secondary)]/60'
                  }`}
                >
                  {/* Index / Status Icon */}
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : isActive ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] animate-pulse-glow">
                        <Play className="h-2.5 w-2.5 text-white" fill="white" />
                      </div>
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-300 text-[10px] font-semibold text-gray-400">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-snug ${
                      isActive ? 'text-[var(--primary)]' : isCompleted ? 'text-emerald-700' :  'text-[var(--foreground)]'
                    }`}>
                      {video.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      {video.duration && (
                        <span className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
                          <Clock className="h-3 w-3" />
                          {video.duration}
                        </span>
                      )}
                      {video.level && (
                        <span className={`rounded-sm px-1.5 py-0.5 text-[10px] font-medium ${
                          video.level === 'Beginner'
                            ? 'bg-green-50 text-green-600'
                            : video.level === 'Intermediate'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-red-50 text-red-600'
                        }`}>
                          {video.level}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
