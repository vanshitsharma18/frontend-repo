import type { IncidentStatus } from '../types'

interface StatusBadgeProps {
  status: IncidentStatus
  showDot?: boolean
}

const config: Record<IncidentStatus, { className: string; label: string; dot: string }> = {
  open: {
    className: 'badge-open',
    label: 'Open',
    dot: 'bg-blue-400 animate-pulse',
  },
  investigating: {
    className: 'badge-investigating',
    label: 'Investigating',
    dot: 'bg-amber-400 animate-pulse',
  },
  resolved: {
    className: 'badge-resolved',
    label: 'Resolved',
    dot: 'bg-emerald-400',
  },
}

export default function StatusBadge({ status, showDot = true }: StatusBadgeProps) {
  const { className, label, dot } = config[status] ?? config.open
  return (
    <span className={className}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dot} mr-1`} />}
      {label}
    </span>
  )
}
