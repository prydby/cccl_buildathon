import React from 'react'

const VERDICT_CONFIG = {
  GO: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    glow: 'shadow-[0_0_30px_rgba(34,197,94,0.15)]',
    label: 'GO',
    icon: '✓',
  },
  CONDITIONAL: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    label: 'CONDITIONAL',
    icon: '⚡',
  },
  NO_GO: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    glow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]',
    label: 'NO-GO',
    icon: '✗',
  },
}

export default function VerdictBanner({ trlResult }) {
  if (!trlResult) return null

  const config = VERDICT_CONFIG[trlResult.verdict]

  return (
    <div className={`rounded-2xl p-6 border ${config.bg} ${config.border} ${config.glow} animate-fade-in-up`}>
      <div className="flex items-center justify-between">
        {/* Verdict */}
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-full ${config.bg} border-2 ${config.border} flex items-center justify-center`}>
            <span className={`text-2xl font-bold ${config.text}`}>{config.icon}</span>
          </div>
          <div>
            <p className="text-xs text-[#64748b] uppercase tracking-wider">Verdict</p>
            <p className={`text-2xl font-bold ${config.text}`}>{config.label}</p>
          </div>
        </div>

        {/* TRL Level */}
        <div className="text-right">
          <p className="text-xs text-[#64748b] uppercase tracking-wider">Technology Readiness</p>
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-3xl font-bold text-[#f1f5f9]">{trlResult.level}</span>
            <span className="text-sm text-[#4b5563]">/ 9</span>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">{trlResult.label}</p>
        </div>
      </div>

      {/* Reason */}
      <p className="mt-4 text-sm text-[#94a3b8] leading-relaxed">{trlResult.verdictReason}</p>

      {/* Gaps summary */}
      <div className="mt-4 flex flex-wrap gap-2">
        {trlResult.blockingGaps.map((gap) => (
          <span key={gap} className="px-2 py-1 text-xs rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            🔴 {gap}
          </span>
        ))}
        {trlResult.warnings.map((warning) => (
          <span key={warning} className="px-2 py-1 text-xs rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            🟡 {warning}
          </span>
        ))}
      </div>

      {/* Time estimate */}
      {trlResult.estimatedWeeks > 0 && (
        <div className="mt-4 pt-4 border-t border-[#1e293b]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#4b5563]">Estimated time to production-ready</span>
            <span className="text-sm font-medium text-[#f1f5f9]">{trlResult.estimatedWeeks} weeks</span>
          </div>
          <div className="mt-2 h-2 bg-[#0a0e17] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, (1 - trlResult.estimatedWeeks / 12) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
