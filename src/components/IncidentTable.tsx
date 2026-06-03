import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import SeverityBadge from './SeverityBadge'
import StatusBadge from './StatusBadge'
import ConfirmDialog from './ConfirmDialog'
import EmptyState from './EmptyState'
import { useDeleteIncident, useUpdateIncident } from '../hooks/useIncidents'
import type { IncidentSummary, IncidentStatus } from '../types'
import { AlertTriangle } from 'lucide-react'

interface IncidentTableProps {
  incidents: IncidentSummary[]
  compact?: boolean
}

type SortKey = 'incident_id' | 'service' | 'severity' | 'status'
type SortDir = 'asc' | 'desc'

const STATUS_OPTIONS: IncidentStatus[] = ['open', 'investigating', 'resolved']

function SortButton({
  label,
  field,
  currentKey,
  currentDir,
  onSort,
}: {
  label: string
  field: SortKey
  currentKey: SortKey
  currentDir: SortDir
  onSort: (f: SortKey) => void
}) {
  const active = currentKey === field
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
    >
      {label}
      {active ? (
        currentDir === 'asc' ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )
      ) : (
        <ChevronDown className="w-3 h-3 opacity-30" />
      )}
    </button>
  )
}

export default function IncidentTable({ incidents, compact = false }: IncidentTableProps) {
  const navigate = useNavigate()
  const [sortKey, setSortKey] = useState<SortKey>('incident_id')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [pendingStatus, setPendingStatus] = useState<IncidentStatus>('open')

  const deleteMutation = useDeleteIncident()
  const updateMutation = useUpdateIncident(editId ?? '')

  const handleSort = (field: SortKey) => {
    if (sortKey === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(field)
      setSortDir('asc')
    }
  }

  const sorted = [...incidents].sort((a, b) => {
    const av = a[sortKey] ?? ''
    const bv = b[sortKey] ?? ''
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sortDir === 'asc' ? cmp : -cmp
  })

  if (incidents.length === 0) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="No incidents found"
        description="No incidents match your current filters. Try adjusting your search or create a new incident."
      />
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th><SortButton label="ID" field="incident_id" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} /></th>
              <th><SortButton label="Service" field="service" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} /></th>
              <th><SortButton label="Severity" field="severity" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} /></th>
              <th><SortButton label="Status" field="status" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} /></th>
              {!compact && <th className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sorted.map((incident) => (
              <tr key={incident.incident_id}>
                <td>
                  <span className="font-mono text-blue-400 text-xs font-semibold">
                    {incident.incident_id}
                  </span>
                </td>
                <td>
                  <span className="font-medium text-slate-200">{incident.service}</span>
                </td>
                <td>
                  <SeverityBadge severity={incident.severity} />
                </td>
                <td>
                  <StatusBadge status={incident.status} />
                </td>
                {!compact && (
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => navigate(`/incidents/${incident.incident_id}`)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditId(incident.incident_id)
                          setPendingStatus(incident.status)
                        }}
                        className="p-1.5 rounded-md text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                        title="Edit status"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(incident.incident_id)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete incident"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit status dialog */}
      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditId(null)} />
          <div className="relative z-10 w-full max-w-xs glass-card p-6 shadow-2xl animate-fade-in">
            <h3 className="text-base font-semibold text-slate-100 mb-1">Update Status</h3>
            <p className="text-xs text-slate-500 mb-4 font-mono">{editId}</p>
            <select
              value={pendingStatus}
              onChange={(e) => setPendingStatus(e.target.value as IncidentStatus)}
              className="form-select mb-4"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <div className="flex gap-2 justify-end">
              <button className="btn-secondary" onClick={() => setEditId(null)}>Cancel</button>
              <button
                className="btn-primary"
                disabled={updateMutation.isPending}
                onClick={() => {
                  updateMutation.mutate({ status: pendingStatus }, {
                    onSuccess: () => setEditId(null),
                  })
                }}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm dialog */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Incident"
        description={`Are you sure you want to permanently delete incident ${deleteId}? This action cannot be undone.`}
        confirmLabel="Delete"
        dangerous
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            })
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </>
  )
}
