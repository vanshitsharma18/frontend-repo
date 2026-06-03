import type { SeverityLevel } from '../types'

interface SeverityBadgeProps {
  severity: SeverityLevel
  showDot?: boolean
}

const config: Record<SeverityLevel, { className: string; label: string; dot: string }> = {
  critical: {
    className: 'badge-critical',
    label: 'Critical',
    dot: 'bg-red-400',
  },
  high: {
    className: 'badge-high',
    label: 'High',
    dot: 'bg-orange-400',
  },
  medium: {
    className: 'badge-medium',
    label: 'Medium',
    dot: 'bg-yellow-400',
  },
  low: {
    className: 'badge-low',
    label: 'Low',
    dot: 'bg-green-400',
  },
}

export default function SeverityBadge({ severity, showDot = true }: SeverityBadgeProps) {
  const { className, label, dot } = config[severity] ?? config.low
  return (
    <span className={className}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dot} mr-1`} />}
      {label}
    </span>
  )
}
