import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useIncidents } from '../hooks/useIncidents'
import MetricCard from '../components/MetricCard'
import IncidentTable from '../components/IncidentTable'
import SeverityChart from '../components/Charts/SeverityChart'
import StatusChart from '../components/Charts/StatusChart'
import { PageLoader } from '../components/LoadingSpinner'
import type { DashboardMetrics } from '../types'

function computeMetrics(incidents: ReturnType<typeof useIncidents>['data']): DashboardMetrics {
  if (!incidents) return { total: 0, open: 0, investigating: 0, resolved: 0, critical: 0 }
  return {
    total: incidents.length,
    open: incidents.filter((i) => i.status === 'open').length,
    investigating: incidents.filter((i) => i.status === 'investigating').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
    critical: incidents.filter((i) => i.severity === 'critical').length,
  }
}

export default function Dashboard() {
  const { data: incidents, isLoading, isError } = useIncidents()

  if (isLoading) return <PageLoader />

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="glass-card p-8 text-center max-w-md">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">Failed to load dashboard</p>
          <p className="text-slate-500 text-sm mt-1">Check that your backend API is running.</p>
        </div>
      </div>
    )
  }

  const metrics = computeMetrics(incidents)
  const recent = incidents?.slice(0, 5) ?? []

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Operations Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time incident status across all services
          </p>
        </div>
        <Link to="/incidents/create" className="btn-primary">
          <Zap className="w-4 h-4" />
          New Incident
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          label="Total Incidents"
          value={metrics.total}
          icon={TrendingUp}
          color="blue"
        />
        <MetricCard
          label="Open"
          value={metrics.open}
          icon={AlertTriangle}
          color="orange"
          trend={metrics.open > 3 ? 'up' : 'stable'}
          trendLabel={metrics.open > 3 ? 'Needs attention' : 'Normal'}
        />
        <MetricCard
          label="Investigating"
          value={metrics.investigating}
          icon={Clock}
          color="amber"
        />
        <MetricCard
          label="Resolved"
          value={metrics.resolved}
          icon={CheckCircle2}
          color="emerald"
          trend="down"
          trendLabel="Resolving fast"
        />
        <MetricCard
          label="Critical"
          value={metrics.critical}
          icon={Zap}
          color="red"
          trend={metrics.critical > 0 ? 'up' : 'stable'}
          trendLabel={metrics.critical > 0 ? 'Urgent!' : 'All clear'}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Severity Distribution</h3>
          <SeverityChart incidents={incidents ?? []} />
        </div>
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Status Distribution</h3>
          <StatusChart incidents={incidents ?? []} />
        </div>
      </div>

      {/* Recent incidents */}
      <div className="glass-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h3 className="text-sm font-semibold text-slate-300">Recent Incidents</h3>
          <Link to="/incidents" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            View all →
          </Link>
        </div>
        <IncidentTable incidents={recent} compact />
      </div>
    </div>
  )
}
