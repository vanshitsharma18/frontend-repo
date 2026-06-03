// ── Enumerations ───────────────────────────────────────────────────────────

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical'
export type IncidentStatus = 'open' | 'investigating' | 'resolved'

// ── Incident Models ────────────────────────────────────────────────────────

/** Lightweight model returned in list responses */
export interface IncidentSummary {
  incident_id: string
  service: string
  severity: SeverityLevel
  status: IncidentStatus
}

/** Full incident detail returned for single-record responses */
export interface Incident {
  incident_id: string
  service: string
  severity: SeverityLevel
  message: string
  status: IncidentStatus
  created_at: string
}

/** POST /incidents payload */
export interface CreateIncidentPayload {
  service: string
  severity: SeverityLevel
  message: string
}

/** PATCH /incidents/:id payload */
export interface UpdateIncidentPayload {
  status: IncidentStatus
}

/** POST /incidents response */
export interface CreateIncidentResponse {
  message: string
  incident_id: string
}

/** Generic message response */
export interface MessageResponse {
  message: string
}

// ── Analysis Models ────────────────────────────────────────────────────────

export interface AnalysisRequest {
  message: string
}

export interface AnalysisResponse {
  severity: SeverityLevel
  possible_root_cause: string
  recommendation: string
}

// ── Dashboard Metrics ──────────────────────────────────────────────────────

export interface DashboardMetrics {
  total: number
  open: number
  investigating: number
  resolved: number
  critical: number
}

// ── UI Helpers ─────────────────────────────────────────────────────────────

export interface SelectOption {
  label: string
  value: string
}

export interface FilterState {
  search: string
  severity: string
  status: string
}
