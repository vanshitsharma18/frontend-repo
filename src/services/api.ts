import axios from 'axios'
import type {
  Incident,
  IncidentSummary,
  CreateIncidentPayload,
  CreateIncidentResponse,
  UpdateIncidentPayload,
  MessageResponse,
  AnalysisRequest,
  AnalysisResponse,
} from '../types'

// ── Axios Instance ─────────────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
})

// Request interceptor — attach auth token if available (future Phase 3)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — unified error normalisation
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ??
      error.response?.data?.message ??
      error.message ??
      'An unexpected error occurred'
    return Promise.reject(new Error(String(message)))
  },
)

// ── Incident API ───────────────────────────────────────────────────────────

export const incidentApi = {
  /** POST /incidents */
  create: (payload: CreateIncidentPayload): Promise<CreateIncidentResponse> =>
    apiClient.post<CreateIncidentResponse>('/incidents', payload).then((r) => r.data),

  /** GET /incidents */
  list: (): Promise<IncidentSummary[]> =>
    apiClient.get<IncidentSummary[]>('/incidents').then((r) => r.data),

  /** GET /incidents/:id */
  get: (id: string): Promise<Incident> =>
    apiClient.get<Incident>(`/incidents/${id}`).then((r) => r.data),

  /** PATCH /incidents/:id */
  update: (id: string, payload: UpdateIncidentPayload): Promise<MessageResponse> =>
    apiClient.patch<MessageResponse>(`/incidents/${id}`, payload).then((r) => r.data),

  /** DELETE /incidents/:id */
  delete: (id: string): Promise<MessageResponse> =>
    apiClient.delete<MessageResponse>(`/incidents/${id}`).then((r) => r.data),
}

// ── Analysis API ───────────────────────────────────────────────────────────

export const analysisApi = {
  /** POST /analyze */
  analyze: (payload: AnalysisRequest): Promise<AnalysisResponse> =>
    apiClient.post<AnalysisResponse>('/analyze', payload).then((r) => r.data),
}

// ── Health API ─────────────────────────────────────────────────────────────

export const healthApi = {
  /** GET /health */
  check: (): Promise<{ status: string }> =>
    apiClient.get<{ status: string }>('/health').then((r) => r.data),
}

export default apiClient
