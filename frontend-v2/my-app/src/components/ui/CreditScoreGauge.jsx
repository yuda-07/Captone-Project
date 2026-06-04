export default function CreditScoreGauge({ score = 0, maxScore = 1000, size = 'lg' }) {
  const percentage = Math.min((score / maxScore) * 100, 100)
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-40 h-40',
    lg: 'w-48 h-48',
    xl: 'w-72 h-72',
  }

  const textSizeClasses = {
    sm: 'text-3xl',
    md: 'text-4xl',
    lg: 'text-display',
    xl: 'text-6xl',
  }

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50" cy="50" r="45"
          fill="transparent"
          stroke="#e4e2e4"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50" cy="50" r="45"
          fill="transparent"
          stroke="#00668a"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${textSizeClasses[size]} font-hanken font-extrabold text-primary leading-none`}>
          {score}
        </span>
        <span className="text-on-surface-variant text-label-sm font-medium">/ {maxScore}</span>
      </div>
    </div>
  )
}
