import React, { useState } from 'react'
import Card from '../../shared/ui/Card.jsx'
import Button from '../../shared/ui/Button.jsx'

const REMEDIATION = {
  'Agent Architecture': [
    'Define explicit context management strategy (sliding window, RAG, hierarchical)',
    'Implement tool error isolation — one failing tool should not crash the agent',
    'Add multi-agent coordination if query complexity requires it',
  ],
  'Model Reliability': [
    'Implement schema validation on all LLM outputs (JSON schema or Zod)',
    'Add confidence thresholds — low-confidence responses trigger fallback',
    'Set up LLM-as-judge for output quality scoring on critical paths',
  ],
  'Delivery & Ops': [
    'Separate prompt/config deployment from code deployment pipeline',
    'Implement instant rollback for prompt versions (< 60 second recovery)',
    'Set up staging environment with production-mirror traffic',
  ],
  'Observability & Evals': [
    'Deploy LLM tracing (Langfuse, Arize, or OpenTelemetry-based)',
    'Build automated eval suite with 50+ test cases covering edge cases',
    'Set up real-time cost dashboard with budget alerting',
  ],
  'Safety & Guardrails': [
    'Implement multi-layer input filtering (format + content + injection)',
    'Schedule regular adversarial/red-team testing (monthly minimum)',
    'Add human-in-the-loop approval gates for high-risk operations',
  ],
  'Scalability & Cost': [
    'Implement semantic caching to reduce redundant LLM calls',
    'Load test to 10x current capacity and identify bottlenecks',
    'Model cost at scale target — ensure economics are sustainable',
  ],
  'Testing Confidence': [
    'Build eval suite: 50+ cases covering happy path, edge cases, adversarial inputs',
    'Add regression tests that run on every prompt/config change',
    'Document known edge cases and failure modes',
  ],
  'User Validation': [
    'Implement systematic feedback capture (in-app, not ad-hoc)',
    'Track task completion rate and identify where users drop off',
    'Set up weekly metrics review: DAU, completion, satisfaction trends',
  ],
}

export default function GapReport({ scorecard, trlResult }) {
  const [showRoadmap, setShowRoadmap] = useState(false)

  if (!scorecard || !trlResult) return null

  const allGaps = scorecard.dimensions
    .filter((d) => d.score !== null && d.score < 7)
    .sort((a, b) => a.score - b.score)

  if (allGaps.length === 0) {
    return (
      <Card glowing className="animate-fade-in-up">
        <div className="text-center py-4">
          <span className="text-3xl">🎉</span>
          <p className="text-sm font-medium text-green-400 mt-2">No critical gaps detected</p>
          <p className="text-xs text-[#64748b] mt-1">System meets production-readiness thresholds across all axes.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#f1f5f9]">Gap Report</h3>
          <p className="text-xs text-[#4b5563]">
            {trlResult.blockingGaps.length} blocking · {trlResult.warnings.length} warnings · {allGaps.length} total
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowRoadmap(!showRoadmap)}>
          {showRoadmap ? '↑ Hide Roadmap' : '🗺️ Remediation Roadmap'}
        </Button>
      </div>

      {/* Gap Cards */}
      <div className="space-y-3">
        {allGaps.map((gap, i) => {
          const isBlocking = gap.score < 5
          const actions = REMEDIATION[gap.name] || ['Investigate and address']

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
                  <span className={`px-1.5 py-0.5 text-[10px] rounded ${
                    isBlocking ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {isBlocking ? 'BLOCKING' : 'WARNING'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#94a3b8] mb-3">{gap.reasoning}</p>
              <div className="space-y-1.5">
                {actions.map((action, j) => (
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

      {/* Remediation Roadmap */}
      {showRoadmap && (
        <Card glowing className="animate-fade-in-up">
          <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">
            Remediation Roadmap
          </h4>
          <div className="space-y-4">
            <RoadmapPhase
              phase="1"
              name="Critical Gaps (Week 1-3)"
              items={trlResult.blockingGaps.map((g) => `Fix: ${g}`)}
              color="red"
            />
            <RoadmapPhase
              phase="2"
              name="Warnings (Week 3-5)"
              items={trlResult.warnings.map((w) => `Improve: ${w}`)}
              color="amber"
            />
            <RoadmapPhase
              phase="3"
              name="Validation (Week 5-6)"
              items={['Re-assess with PilotIQ', 'Load test at scale target', 'Stakeholder sign-off']}
              color="green"
            />
          </div>
          <div className="mt-4 pt-4 border-t border-[#1e293b] flex items-center justify-between">
            <span className="text-xs text-[#4b5563]">Target: TRL {Math.min(9, trlResult.level + 2)} → {trlResult.verdict === 'NO_GO' ? 'CONDITIONAL' : 'GO'}</span>
            <span className="text-xs text-cyan-400">{trlResult.estimatedWeeks} weeks estimated</span>
          </div>
        </Card>
      )}
    </div>
  )
}

function RoadmapPhase({ phase, name, items, color }) {
  const colors = {
    red: 'border-red-500/30 text-red-400',
    amber: 'border-amber-500/30 text-amber-400',
    green: 'border-green-500/30 text-green-400',
  }
  return (
    <div className={`pl-4 border-l-2 ${colors[color]}`}>
      <p className="text-xs font-medium text-[#f1f5f9] mb-1.5">Phase {phase}: {name}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-[#94a3b8]">• {item}</li>
        ))}
      </ul>
    </div>
  )
}
