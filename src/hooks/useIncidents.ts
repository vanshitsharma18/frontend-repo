import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { incidentApi } from '../services/api'
import type { CreateIncidentPayload, UpdateIncidentPayload } from '../types'

// ── Query Keys ─────────────────────────────────────────────────────────────

export const incidentKeys = {
  all: ['incidents'] as const,
  lists: () => [...incidentKeys.all, 'list'] as const,
  detail: (id: string) => [...incidentKeys.all, 'detail', id] as const,
}

// ── Queries ────────────────────────────────────────────────────────────────

/** Fetch all incidents (summary list) */
export function useIncidents() {
  return useQuery({
    queryKey: incidentKeys.lists(),
    queryFn: incidentApi.list,
  })
}

/** Fetch a single incident by ID */
export function useIncident(id: string) {
  return useQuery({
    queryKey: incidentKeys.detail(id),
    queryFn: () => incidentApi.get(id),
    enabled: Boolean(id),
  })
}

// ── Mutations ──────────────────────────────────────────────────────────────

/** Create a new incident */
export function useCreateIncident() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: CreateIncidentPayload) => incidentApi.create(payload),
    onSuccess: (data) => {
      toast.success(`Incident ${data.incident_id} created successfully!`)
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() })
      navigate('/incidents')
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to create incident')
    },
  })
}

/** Update an incident's status */
export function useUpdateIncident(incidentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateIncidentPayload) =>
      incidentApi.update(incidentId, payload),
    onSuccess: () => {
      toast.success('Incident status updated!')
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: incidentKeys.detail(incidentId) })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to update incident')
    },
  })
}

/** Delete an incident */
export function useDeleteIncident() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (id: string) => incidentApi.delete(id),
    onSuccess: (_data, id) => {
      toast.success(`Incident ${id} deleted.`)
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() })
      navigate('/incidents')
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to delete incident')
    },
  })
}
