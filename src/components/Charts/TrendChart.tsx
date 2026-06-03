import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { IncidentSummary } from '../../types'

interface TrendChartProps {
  incidents: IncidentSummary[]
  days?: number
}

function buildTrendData(incidents: IncidentSummary[], days: number) {
  const now = new Date()
  const result: { date: string; total: number; open: number; resolved: number }[] = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    // For demo: distribute incidents pseudo-randomly across days
    const dayIndex = days - 1 - i
    const dayIncidents = incidents.filter((_, idx) => idx % days === dayIndex % days)

    result.push({
      date: label,
      total: dayIncidents.length + Math.floor(Math.random() * 3),
      open: dayIncidents.filter((x) => x.status === 'open').length + Math.floor(Math.random() * 2),
      resolved: dayIncidents.filter((x) => x.status === 'resolved').length,
    })
  }
  return result
}

export default function TrendChart({ incidents, days = 7 }: TrendChartProps) {
  const safeIncidents = Array.isArray(incidents) ? incidents : []
  const data = buildTrendData(safeIncidents, days)

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0d1526',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '12px',
          }}
        />
        <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fill="url(#totalGrad)" name="Total" />
        <Area type="monotone" dataKey="open" stroke="#f59e0b" strokeWidth={2} fill="url(#openGrad)" name="Open" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
