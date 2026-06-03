import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { IncidentSummary } from '../../types'

interface StatusChartProps {
  incidents: IncidentSummary[]
}

const STATUS_COLORS = {
  open: '#3b82f6',
  investigating: '#f59e0b',
  resolved: '#10b981',
}

export default function StatusChart({ incidents }: StatusChartProps) {
  const safeIncidents = Array.isArray(incidents) ? incidents : []
  const data = [
    { name: 'Open', key: 'open', value: safeIncidents.filter((i) => i.status === 'open').length },
    { name: 'Investigating', key: 'investigating', value: safeIncidents.filter((i) => i.status === 'investigating').length },
    { name: 'Resolved', key: 'resolved', value: safeIncidents.filter((i) => i.status === 'resolved').length },
  ]

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={36} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="name"
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
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          contentStyle={{
            backgroundColor: '#0d1526',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '12px',
          }}
          formatter={(value: number, _name: string, props: { payload?: { name: string } }) => [value, props?.payload?.name]}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.key}
              fill={STATUS_COLORS[entry.key as keyof typeof STATUS_COLORS] ?? '#6b7280'}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
