import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight, Clock, Users } from 'lucide-react'
import ProgressBar from './ProgressBar'
import { categoryColors, levelColors } from '../data/dummyData'

export default function CourseCard({ course, progress = 0, playlistCount = 0, completedCount = 0, index = 0 }) {
  const colors = categoryColors[course.category] || { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' }
  const levelColor = levelColors[course.level] || { bg: 'bg-slate-100', text: 'text-slate-700' }

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--primary)]/[0.08]"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Top gradient bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)]" />

      <div className="flex flex-1 flex-col p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors.bg} transition-transform duration-300 group-hover:scale-110`}>
            <BookOpen className={`h-5 w-5 ${colors.text}`} />
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${levelColor.bg} ${levelColor.text}`}>
            {course.level}
          </span>
        </div>

        {/* Info */}
        <h3 className="mb-2 text-lg font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
          {course.name}
        </h3>
        <p className="mb-4 line-clamp-2 flex-grow text-sm leading-relaxed text-[var(--muted-foreground)]">
          {course.description}
        </p>

        {/* Meta */}
        <div className="mb-4 flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
          {course.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {course.duration}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {playlistCount} videos
          </span>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <ProgressBar progress={progress} size="small" showLabel={false} animated />
          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className="text-[var(--muted-foreground)]">
              {completedCount}/{playlistCount} completed
            </span>
            <span className="font-semibold text-[var(--primary)]">{progress}%</span>
          </div>
        </div>

        {/* Action */}
        <Link
          to={`/course/${course.id}`}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[var(--primary)]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/30 hover:brightness-110"
        >
          {progress > 0 ? 'Continue Learning' : 'Start Learning'}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
