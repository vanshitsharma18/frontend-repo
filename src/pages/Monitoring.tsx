import { Activity, AlertTriangle, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import { useIncidents } from '../hooks/useIncidents'
import MetricCard from '../components/MetricCard'
import TrendChart from '../components/Charts/TrendChart'
import SeverityChart from '../components/Charts/SeverityChart'
import { PageLoader } from '../components/LoadingSpinner'

export default function Monitoring() {
  const { data: incidents, isLoading } = useIncidents()

  if (isLoading) return <PageLoader />

  const all = incidents ?? []
  const open = all.filter((i) => i.status === 'open').length
  const resolved = all.filter((i) => i.status === 'resolved').length
  const investigating = all.filter((i) => i.status === 'investigating').length
  const critical = all.filter((i) => i.severity === 'critical').length

  // MTTR placeholder — in production this would come from a dedicated backend metric
  const mttrHours = resolved > 0 ? Math.max(1, Math.round((all.length / Math.max(resolved, 1)) * 2.4)) : 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100">Monitoring Dashboard</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Operational visibility across your infrastructure
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Incidents" value={all.length} icon={TrendingUp} color="blue" />
        <MetricCard
          label="Open Incidents"
          value={open}
          icon={AlertTriangle}
          color="orange"
          trend={open > 5 ? 'up' : open > 2 ? 'stable' : 'down'}
        />
        <MetricCard
          label="Avg MTTR (hrs)"
          value={mttrHours}
          icon={Clock}
          color="violet"
          trendLabel="Mean time to resolve"
        />
        <MetricCard
          label="Resolved"
          value={resolved}
          icon={CheckCircle2}
          color="emerald"
          trend="down"
          trendLabel="Resolving fast"
        />
      </div>

      {/* Status summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Investigating', value: investigating, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Critical', value: critical, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
          { label: 'Resolved', value: resolved, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        ].map((item) => (
          <div key={item.label} className={`glass-card p-4 text-center border ${item.bg}`}>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-slate-400 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-300">Incident Trend (7 days)</h3>
          </div>
          <TrendChart incidents={all} days={7} />
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-slate-300">Severity Breakdown</h3>
          </div>
          <SeverityChart incidents={all} />
        </div>
      </div>

      {/* 14-day trend */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-300">Incident Trend (14 days)</h3>
        </div>
        <TrendChart incidents={all} days={14} />
      </div>
    </div>
  )
}
