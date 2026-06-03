import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { analysisApi } from '../services/api'
import type { AnalysisRequest } from '../types'

/** Run AI analysis on an incident message */
export function useAnalyze() {
  return useMutation({
    mutationFn: (payload: AnalysisRequest) => analysisApi.analyze(payload),
    onError: (error: Error) => {
      toast.error(error.message ?? 'Analysis failed — please try again')
    },
  })
}
