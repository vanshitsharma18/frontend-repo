import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Server, FileText, Zap } from 'lucide-react'
import { useCreateIncident } from '../hooks/useIncidents'
import type { CreateIncidentPayload, SeverityLevel } from '../types'

const SEVERITY_OPTIONS: { value: SeverityLevel; label: string; desc: string; color: string }[] = [
  { value: 'low', label: 'Low', desc: 'Minor issue, no immediate impact', color: 'border-green-500/40 bg-green-500/5 text-green-400' },
  { value: 'medium', label: 'Medium', desc: 'Degraded performance, partial impact', color: 'border-yellow-500/40 bg-yellow-500/5 text-yellow-400' },
  { value: 'high', label: 'High', desc: 'Service disruption, significant impact', color: 'border-orange-500/40 bg-orange-500/5 text-orange-400' },
  { value: 'critical', label: 'Critical', desc: 'Complete outage, business critical', color: 'border-red-500/40 bg-red-500/5 text-red-400' },
]

export default function CreateIncident() {
  const createMutation = useCreateIncident()
  const [form, setForm] = useState<CreateIncidentPayload>({
    service: '',
    severity: 'medium',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<CreateIncidentPayload>>({})

  const validate = (): boolean => {
    const e: Partial<CreateIncidentPayload> = {}
    if (!form.service.trim()) e.service = 'Service name is required'
    if (!form.message.trim()) e.message = 'Description is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    createMutation.mutate(form)
  }

  return (
    <div className="max-w-2xl space-y-5 animate-fade-in">
      {/* Back */}
      <Link to="/incidents" className="btn-secondary text-xs inline-flex">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Incidents
      </Link>

      {/* Card */}
      <div className="glass-card p-6 space-y-6">
        {/* Title */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/8">
          <div className="p-2 rounded-xl bg-blue-500/15">
            <AlertTriangle className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100">Report New Incident</h2>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the details below to create an incident record</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Service name */}
          <div>
            <label htmlFor="service" className="form-label flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-500" /> Service Name
            </label>
            <input
              id="service"
              type="text"
              placeholder="e.g. payment-service, auth-api, frontend"
              value={form.service}
              onChange={(e) => {
                setForm((f) => ({ ...f, service: e.target.value }))
                if (errors.service) setErrors((er) => ({ ...er, service: undefined }))
              }}
              className={`form-input ${errors.service ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
            />
            {errors.service && (
              <p className="text-xs text-red-400 mt-1">{errors.service}</p>
            )}
          </div>

          {/* Severity */}
          <div>
            <label className="form-label flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-slate-500" /> Severity Level
            </label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {SEVERITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, severity: opt.value }))}
                  className={`
                    p-3 rounded-lg border text-left transition-all duration-150
                    ${form.severity === opt.value
                      ? `${opt.color} ring-1 ring-current`
                      : 'border-white/10 bg-white/3 text-slate-400 hover:bg-white/6'
                    }
                  `}
                >
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="message" className="form-label flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" /> Description
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Describe the incident in detail — what is happening, who is affected, and any initial observations..."
              value={form.message}
              onChange={(e) => {
                setForm((f) => ({ ...f, message: e.target.value }))
                if (errors.message) setErrors((er) => ({ ...er, message: undefined }))
              }}
              className={`form-input resize-none ${errors.message ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
            />
            <div className="flex justify-between mt-1">
              {errors.message ? (
                <p className="text-xs text-red-400">{errors.message}</p>
              ) : <span />}
              <p className="text-xs text-slate-600">{form.message.length}/2048</p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Link to="/incidents" className="btn-secondary flex-1 justify-center">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn-primary flex-1 justify-center"
            >
              <AlertTriangle className="w-4 h-4" />
              {createMutation.isPending ? 'Creating...' : 'Create Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
