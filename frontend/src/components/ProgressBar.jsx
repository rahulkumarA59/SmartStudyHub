export default function ProgressBar({ progress = 0, showLabel = true, size = 'default', animated = false, color = 'primary' }) {
  const heightClass = {
    small: 'h-1.5',
    default: 'h-3',
    large: 'h-4',
  }[size] || 'h-3'

  const colorClass = {
    primary: 'bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)]',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-400',
    danger: 'bg-gradient-to-r from-red-500 to-pink-400',
  }[color] || 'bg-gradient-to-r from-[var(--primary)] to-[hsl(263,70%,58%)]'

  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-[var(--muted-foreground)]">Progress</span>
          <span className="font-bold text-[var(--primary)]">{clampedProgress}%</span>
        </div>
      )}
      <div className={`${heightClass} overflow-hidden rounded-full bg-[var(--secondary)]`}>
        <div
          className={`${heightClass} rounded-full ${colorClass} transition-all duration-700 ease-out ${
            animated && clampedProgress > 0 && clampedProgress < 100 ? 'progress-striped' : ''
          }`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
}
