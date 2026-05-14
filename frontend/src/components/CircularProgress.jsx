export default function CircularProgress({ progress = 0, size = 120, strokeWidth = 8, showLabel = true }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedProgress = Math.min(100, Math.max(0, progress))
  const offset = circumference - (clampedProgress / 100) * circumference

  const progressColor = clampedProgress === 100
    ? '#10b981'
    : clampedProgress >= 50
      ? '#2563eb'
      : '#f59e0b'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="circular-progress" width={size} height={size}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="hsl(214 32% 91%)"
          fill="none"
        />
        {/* Gradient Definition */}
        <defs>
          <linearGradient id={`progress-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={clampedProgress === 100 ? '#10b981' : `url(#progress-gradient-${size})`}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${progressColor}33)` }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[var(--foreground)]">{clampedProgress}%</span>
          <span className="text-xs text-[var(--muted-foreground)]">Complete</span>
        </div>
      )}
    </div>
  )
}
