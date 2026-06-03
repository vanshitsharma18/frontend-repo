import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: number
  icon: LucideIcon
  color: 'blue' | 'orange' | 'amber' | 'emerald' | 'red' | 'violet'
  trend?: 'up' | 'down' | 'stable'
  trendLabel?: string
  loading?: boolean
}

const colorMap = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: 'text-blue-400',
    iconBg: 'bg-blue-500/15',
    value: 'text-blue-300',
    glow: 'shadow-blue-500/10',
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    icon: 'text-orange-400',
    iconBg: 'bg-orange-500/15',
    value: 'text-orange-300',
    glow: 'shadow-orange-500/10',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: 'text-amber-400',
    iconBg: 'bg-amber-500/15',
    value: 'text-amber-300',
    glow: 'shadow-amber-500/10',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15',
    value: 'text-emerald-300',
    glow: 'shadow-emerald-500/10',
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: 'text-red-400',
    iconBg: 'bg-red-500/15',
    value: 'text-red-300',
    glow: 'shadow-red-500/10',
  },
  violet: {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    icon: 'text-violet-400',
    iconBg: 'bg-violet-500/15',
    value: 'text-violet-300',
    glow: 'shadow-violet-500/10',
  },
}

export default function MetricCard({
  label,
  value,
  icon: Icon,
  color,
  trend,
  trendLabel,
  loading = false,
}: MetricCardProps) {
  const c = colorMap[color]

  if (loading) {
    return (
      <div className="glass-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="skeleton h-4 w-28 rounded" />
          <div className="skeleton w-10 h-10 rounded-xl" />
        </div>
        <div className="skeleton h-8 w-16 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    )
  }

  return (
    <div
      className={`
        glass-card-hover p-5 space-y-3 cursor-default
        shadow-lg ${c.glow} ${c.bg} ${c.border}
      `}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <div className={`p-2 rounded-xl ${c.iconBg}`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
      </div>

      {/* Value */}
      <p className={`text-3xl font-bold tracking-tight animate-count-up ${c.value}`}>
        {value.toLocaleString()}
      </p>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1.5 text-xs">
          {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-red-400" />}
          {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />}
          {trend === 'stable' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
          <span className={
            trend === 'up' ? 'text-red-400' :
            trend === 'down' ? 'text-emerald-400' :
            'text-slate-400'
          }>
            {trendLabel ?? (trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable')}
          </span>
        </div>
      )}
    </div>
  )
}
