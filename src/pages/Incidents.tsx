import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, PlusCircle, SlidersHorizontal, X } from 'lucide-react'
import { useIncidents } from '../hooks/useIncidents'
import IncidentTable from '../components/IncidentTable'
import { PageLoader } from '../components/LoadingSpinner'
import type { FilterState } from '../types'

const SEVERITY_OPTIONS = ['', 'critical', 'high', 'medium', 'low']
const STATUS_OPTIONS = ['', 'open', 'investigating', 'resolved']
const PAGE_SIZE = 10

export default function Incidents() {
  const { data: incidents, isLoading, isError, refetch } = useIncidents()
  const [filters, setFilters] = useState<FilterState>({ search: '', severity: '', status: '' })
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!incidents) return []
    return incidents.filter((inc) => {
      const searchMatch =
        !filters.search ||
        inc.incident_id.toLowerCase().includes(filters.search.toLowerCase()) ||
        inc.service.toLowerCase().includes(filters.search.toLowerCase())
      const severityMatch = !filters.severity || inc.severity === filters.severity
      const statusMatch = !filters.status || inc.status === filters.status
      return searchMatch && severityMatch && statusMatch
    })
  }, [incidents, filters])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const hasFilters = filters.search || filters.severity || filters.status
  const clearFilters = () => {
    setFilters({ search: '', severity: '', status: '' })
    setPage(1)
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">All Incidents</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} of {incidents?.length ?? 0} incidents
          </p>
        </div>
        <Link to="/incidents/create" className="btn-primary">
          <PlusCircle className="w-4 h-4" />
          New Incident
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="incidents-search"
              type="text"
              placeholder="Search by ID or service..."
              value={filters.search}
              onChange={(e) => { setFilters((f) => ({ ...f, search: e.target.value })); setPage(1) }}
              className="form-input pl-9"
            />
          </div>

          {/* Severity filter */}
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <select
              id="severity-filter"
              value={filters.severity}
              onChange={(e) => { setFilters((f) => ({ ...f, severity: e.target.value })); setPage(1) }}
              className="form-select pl-9 pr-8 w-full sm:w-40"
            >
              {SEVERITY_OPTIONS.map((s) => (
                <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Severities'}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setPage(1) }}
              className="form-select pr-8 w-full sm:w-40"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Statuses'}</option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className="btn-secondary shrink-0">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="glass-card p-5 text-center">
          <p className="text-red-400 text-sm">Failed to load incidents.</p>
          <button className="btn-secondary mt-3 text-xs" onClick={() => refetch()}>Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="glass-card">
        <IncidentTable incidents={paginated} />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
