import { useState } from 'react'
import {
  Brain,
  Send,
  Loader2,
  AlertTriangle,
  Lightbulb,
  Stethoscope,
  Sparkles,
} from 'lucide-react'
import { useAnalyze } from '../hooks/useAnalysis'
import SeverityBadge from '../components/SeverityBadge'
import type { AnalysisResponse, SeverityLevel } from '../types'

const EXAMPLE_MESSAGES = [
  'Database connection timeout in production',
  'Out of memory error on payment service',
  'CPU spike to 100% on auth-api pod',
  'Disk full on logging server',
  '429 Too Many Requests from upstream API',
]

export default function Analysis() {
  const [message, setMessage] = useState('')
  const analyzeMutation = useAnalyze()
  const result = analyzeMutation.data

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    analyzeMutation.mutate({ message })
  }

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-violet-500/15 border border-violet-500/25">
          <Brain className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">AI Incident Analysis</h2>
          <p className="text-sm text-slate-500">
            Describe an incident — get instant root cause analysis and recommendations
          </p>
        </div>
        <span className="ml-auto px-2.5 py-1 text-xs font-medium rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/25 hidden sm:block">
          Phase 1 · Rule-Based
        </span>
      </div>

      {/* Input card */}
      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="analysis-message" className="form-label text-sm">
            Describe the incident or error
          </label>
          <div className="relative">
            <textarea
              id="analysis-message"
              rows={4}
              placeholder="e.g. Database connection timeout on payment-service pods in us-central1..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-input resize-none pr-12"
            />
          </div>

          {/* Example chips */}
          <div>
            <p className="text-xs text-slate-500 mb-2">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_MESSAGES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setMessage(ex)}
                  className="px-2.5 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10 hover:border-white/20 transition-all duration-150"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={analyzeMutation.isPending || !message.trim()}
            className="btn-primary w-full justify-center"
          >
            {analyzeMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Analyze Incident
              </>
            )}
          </button>
        </form>
      </div>

      {/* Loading state */}
      {analyzeMutation.isPending && (
        <div className="glass-card p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
            <span className="text-sm text-slate-400">AI engine processing...</span>
          </div>
          <div className="flex justify-center gap-1 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Result card */}
      {result && !analyzeMutation.isPending && (
        <AnalysisResult result={result} message={message} />
      )}
    </div>
  )
}

function AnalysisResult({ result, message }: { result: AnalysisResponse; message: string }) {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Analysed message */}
      <div className="px-4 py-3 rounded-lg bg-white/3 border border-white/8">
        <p className="text-xs text-slate-500 mb-1">Analysed message</p>
        <p className="text-sm text-slate-300 italic">"{message}"</p>
      </div>

      {/* Severity result */}
      <div className="glass-card p-5 flex items-center gap-4 border-l-4 border-l-blue-500/50">
        <div className="p-2.5 rounded-xl bg-blue-500/10">
          <AlertTriangle className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Predicted Severity</p>
          <SeverityBadge severity={result.severity as SeverityLevel} />
        </div>
        <Sparkles className="w-4 h-4 text-violet-400 opacity-60" />
      </div>

      {/* Root cause */}
      <div className="glass-card p-5 space-y-2">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-amber-400" />
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Possible Root Cause</p>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">{result.possible_root_cause}</p>
      </div>

      {/* Recommendation */}
      <div className="glass-card p-5 space-y-2 border border-emerald-500/15 bg-emerald-500/5">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-emerald-400" />
          <p className="text-xs text-emerald-500 uppercase tracking-wider font-semibold">Recommendation</p>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">{result.recommendation}</p>
      </div>

      {/* Phase 2 teaser */}
      <div className="px-4 py-3 rounded-lg border border-violet-500/20 bg-violet-500/5 flex items-center gap-3">
        <Brain className="w-4 h-4 text-violet-400 shrink-0" />
        <p className="text-xs text-slate-400">
          <span className="text-violet-400 font-medium">Phase 2 coming soon:</span>{' '}
          Google Gemini integration for deeper LLM-powered analysis
        </p>
      </div>
    </div>
  )
}
