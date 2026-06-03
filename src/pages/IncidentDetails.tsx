import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  Server,
  Hash,
  MessageSquare,
  Edit3,
  Trash2,
  CheckCircle2,
} from 'lucide-react'
import { useIncident, useUpdateIncident, useDeleteIncident } from '../hooks/useIncidents'
import SeverityBadge from '../components/SeverityBadge'
import StatusBadge from '../components/StatusBadge'
import ConfirmDialog from '../components/ConfirmDialog'
import { PageLoader } from '../components/LoadingSpinner'
import type { IncidentStatus } from '../types'

const STATUS_OPTIONS: IncidentStatus[] = ['open', 'investigating', 'resolved']

export default function IncidentDetails() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: incident, isLoading, isError } = useIncident(id)
  const updateMutation = useUpdateIncident(id)
  const deleteMutation = useDeleteIncident()

  const [editingStatus, setEditingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState<IncidentStatus>('open')
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (isLoading) return <PageLoader />

  if (isError || !incident) {
    return (
      <div className="space-y-4">
        <Link to="/incidents" className="btn-secondary text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Incidents
        </Link>
        <div className="glass-card p-10 text-center">
          <p className="text-slate-400">Incident not found or failed to load.</p>
        </div>
      </div>
    )
  }

  const handleStatusUpdate = () => {
    updateMutation.mutate({ status: newStatus }, {
      onSuccess: () => setEditingStatus(false),
    })
  }

  return (
    <div className="space-y-5 max-w-3xl animate-fade-in">
      {/* Back link */}
      <Link to="/incidents" className="btn-secondary text-xs inline-flex">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Incidents
      </Link>

      {/* Header card */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-blue-400 font-bold text-lg">
                {incident.incident_id}
              </span>
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
            </div>
            <p className="text-slate-400 text-sm">
              Created{' '}
              {new Date(incident.created_at).toLocaleString('en-US', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 shrink-0">
            <button
              className="btn-secondary text-xs"
              onClick={() => {
                setNewStatus(incident.status)
                setEditingStatus(true)
              }}
            >
              <Edit3 className="w-3.5 h-3.5" /> Update Status
            </button>
            <button
              className="btn-danger text-xs"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Detail fields */}
      <div className="glass-card p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <DetailField icon={Server} label="Affected Service" value={incident.service} />
        <DetailField icon={Hash} label="Incident ID" value={incident.incident_id} mono />
        <DetailField icon={CheckCircle2} label="Severity" value={<SeverityBadge severity={incident.severity} />} />
        <DetailField icon={CheckCircle2} label="Status" value={<StatusBadge status={incident.status} />} />
        <DetailField
          icon={Clock}
          label="Created At"
          value={new Date(incident.created_at).toLocaleString()}
          className="sm:col-span-2"
        />
        <DetailField
          icon={MessageSquare}
          label="Description"
          value={incident.message}
          className="sm:col-span-2"
        />
      </div>

      {/* Status edit modal */}
      {editingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingStatus(false)} />
          <div className="relative z-10 w-full max-w-sm glass-card p-6 shadow-2xl animate-fade-in">
            <h3 className="text-base font-semibold text-slate-100 mb-4">Update Status</h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as IncidentStatus)}
              className="form-select mb-5"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <div className="flex gap-2 justify-end">
              <button className="btn-secondary" onClick={() => setEditingStatus(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                disabled={updateMutation.isPending}
                onClick={handleStatusUpdate}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={confirmDelete}
        title="Delete Incident"
        description={`Permanently delete ${incident.incident_id}? This cannot be undone.`}
        confirmLabel="Delete Incident"
        dangerous
        loading={deleteMutation.isPending}
        onConfirm={() => {
          deleteMutation.mutate(id, {
            onSuccess: () => navigate('/incidents'),
          })
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}

function DetailField({
  icon: Icon,
  label,
  value,
  mono = false,
  className = '',
}: {
  icon: typeof Server
  label: string
  value: React.ReactNode
  mono?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      </div>
      <div className={`text-sm text-slate-200 ${mono ? 'font-mono text-blue-400' : ''}`}>
        {value}
      </div>
    </div>
  )
}
