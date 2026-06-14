import React, { useState } from 'react'
import Card from '../../shared/ui/Card.jsx'
import Button from '../../shared/ui/Button.jsx'

/**
 * GapReport — renders the core engine's gap analysis.
 * Consumes `gaps` (from analyzeGaps) so remediation is sourced from the
 * framework definition, never hardcoded against stale axis names.
 */
export default function GapReport({ trlResult, gaps }) {
  const [showRoadmap, setShowRoadmap] = useState(false)

  if (!gaps) return null
  const { gaps: gapList, blocking, warnings, roadmap } = gaps

  if (gapList.length === 0) {
    return (
      <Card glowing className="animate-fade-in-up">
        <div className="text-center py-4">
          <span className="text-3xl">🎉</span>
          <p className="text-sm font-medium text-green-400 mt-2">No gaps detected</p>
          <p className="text-xs text-[#64748b] mt-1">Meets production-readiness thresholds across all axes.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#f1f5f9]">Gap Report</h3>
          <p className="text-xs text-[#4b5563]">
            {blocking.length} blocking · {warnings.length} warning{warnings.length !== 1 ? 's' : ''} · {gapList.length} total
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowRoadmap(!showRoadmap)}>
          {showRoadmap ? '↑ Hide Roadmap' : '🗺️ Remediation Roadmap'}
        </Button>
      </div>

      {/* Gap cards */}
      <div className="space-y-3">
        {gapList.map((gap, i) => {
          const isBlocking = gap.severity === 'blocking'
          return (
            <Card
              key={gap.name}
              className={`!p-4 animate-fade-in-up ${isBlocking ? 'border-red-500/20' : 'border-amber-500/10'}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isBlocking ? 'bg-red-400' : 'bg-amber-400'}`} />
                  <h4 className="text-sm font-medium text-[#f1f5f9]">{gap.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${isBlocking ? 'text-red-400' : 'text-amber-400'}`}>
                    {gap.score.toFixed(1)}
                  </span>
                  <span className={`px-1.5 py-0.5 text-[10px] rounded font-medium ${
                    isBlocking ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {isBlocking ? 'BLOCKING' : 'WARNING'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#94a3b8] mb-3 leading-relaxed">{gap.reasoning}</p>

              {/* Benchmark — what "good" looks like */}
              {gap.benchmark && (
                <div className="mb-3 px-2.5 py-2 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                  <p className="text-[10px] text-cyan-400/80"><span className="font-medium">Benchmark:</span> {gap.benchmark}</p>
                </div>
              )}

              {/* Remediation from core */}
              <div className="space-y-1.5">
                <p className="text-[10px] text-[#4b5563] uppercase tracking-wider">Recommended actions</p>
                {gap.remediation.map((action, j) => (
                  <div key={j} className="flex items-start gap-2 text-xs text-[#cbd5e1]">
                    <span className="text-cyan-400 mt-0.5 flex-shrink-0">→</span>
                    {action}
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Roadmap */}
      {showRoadmap && (
        <Card glowing className="animate-fade-in-up">
          <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">Remediation Roadmap</h4>
          <div className="space-y-4">
            {roadmap.map((phase) => (
              <RoadmapPhase key={phase.phase} phase={phase} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#1e293b] flex items-center justify-between">
            <span className="text-xs text-[#4b5563]">
              Target: TRL {Math.min(9, (trlResult?.level || 5) + 2)} → {trlResult?.verdict === 'NO_GO' ? 'CONDITIONAL' : 'GO'}
            </span>
            <span className="text-xs text-cyan-400">{trlResult?.estimatedWeeks} weeks estimated</span>
          </div>
        </Card>
      )}
    </div>
  )
}

function RoadmapPhase({ phase }) {
  const colors = {
    blocking: 'border-red-500/30 text-red-400',
    warning: 'border-amber-500/30 text-amber-400',
    validation: 'border-green-500/30 text-green-400',
  }
  return (
    <div className={`pl-4 border-l-2 ${colors[phase.severity] || colors.validation}`}>
      <p className="text-xs font-medium text-[#f1f5f9] mb-1.5">
        Phase {phase.phase}: {phase.name} <span className="text-[#4b5563] font-normal">({phase.window})</span>
      </p>
      <ul className="space-y-1">
        {phase.items.map((item, i) => (
          <li key={i} className="text-xs text-[#94a3b8]">• {item}</li>
        ))}
      </ul>
    </div>
  )
}
