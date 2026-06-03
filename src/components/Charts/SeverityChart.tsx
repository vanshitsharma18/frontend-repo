import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { IncidentSummary } from '../../types'

interface SeverityChartProps {
  incidents: IncidentSummary[]
}

const COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
}

const LABEL_COLORS = {
  critical: '#fca5a5',
  high: '#fdba74',
  medium: '#fde047',
  low: '#86efac',
}

export default function SeverityChart({ incidents }: SeverityChartProps) {
  const data = Object.entries(
    incidents.reduce<Record<string, number>>((acc, inc) => {
      acc[inc.severity] = (acc[inc.severity] ?? 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), key: name, value }))

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        No data to display
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell
              key={entry.key}
              fill={COLORS[entry.key as keyof typeof COLORS] ?? '#6b7280'}
              stroke="transparent"
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#0d1526',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '12px',
          }}
          formatter={(value: number, name: string) => [value, name]}
        />
        <Legend
          formatter={(value, entry) => (
            <span style={{ color: LABEL_COLORS[(entry as { payload?: { key: string } }).payload?.key as keyof typeof LABEL_COLORS] ?? '#94a3b8', fontSize: '12px' }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
