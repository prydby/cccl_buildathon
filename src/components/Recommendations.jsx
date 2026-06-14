import React, { useState } from 'react'
import Card from './ui/Card.jsx'
import Button from './ui/Button.jsx'

/**
 * Generates actionable recommendations based on scores.
 * Focuses on weakest dimensions with specific, practical steps.
 */
function generateRecommendations(dimensions) {
  const sorted = [...dimensions]
    .filter((d) => d.score !== null)
    .sort((a, b) => a.score - b.score)

  const weak = sorted.filter((d) => d.score < 7)
  const strong = sorted.filter((d) => d.score >= 8)

  const recommendations = {
    'Market Opportunity': {
      actions: [
        'Validate TAM with bottom-up analysis using customer data',
        'Identify adjacent markets for expansion in 12-18 months',
        'Commission or reference industry analyst reports for credibility',
      ],
      priority: 'medium',
    },
    'Product Differentiation': {
      actions: [
        'File provisional patents on core algorithms or processes',
        'Build proprietary data flywheel from user interactions',
        'Increase switching costs through deeper integrations and data lock-in',
      ],
      priority: 'high',
    },
    'Team & Execution': {
      actions: [
        'Fill key leadership gaps (VP Eng, VP Sales) within 90 days',
        'Implement OKR framework to improve execution visibility',
        'Add independent board advisors with domain expertise',
      ],
      priority: 'high',
    },
    'Financial Health': {
      actions: [
        'Reduce burn multiple to <1.5x through operational efficiency',
        'Accelerate path to cash-flow positive in core segment',
        'Diversify revenue with annual contracts to improve predictability',
      ],
      priority: 'high',
    },
    'Scalability': {
      actions: [
        'Invest in self-serve onboarding to reduce CAC',
        'Automate manual processes that require headcount scaling',
        'Build platform APIs to enable partner-driven growth',
      ],
      priority: 'medium',
    },
    'Competitive Moat': {
      actions: [
        'Accelerate data network effects — more users = better product',
        'Pursue strategic partnerships that create exclusive advantages',
        'Build community/ecosystem around the platform to increase lock-in',
      ],
      priority: 'high',
    },
    'Risk Profile': {
      actions: [
        'Reduce customer concentration — no single customer >10% of revenue',
        'Implement multi-provider strategy for key dependencies',
        'Create documented contingency plans for top 3 identified risks',
      ],
      priority: 'medium',
    },
  }

  return {
    weakDimensions: weak.map((d) => ({
      ...d,
      ...(recommendations[d.name] || { actions: ['Investigate further'], priority: 'medium' }),
    })),
    strengths: strong.map((d) => d.name),
    overallStrategy: weak.length === 0
      ? 'Strong across all dimensions. Focus on maintaining momentum and exploring expansion.'
      : `Priority focus areas: ${weak.slice(0, 3).map((d) => d.name).join(', ')}. Addressing these could increase overall score by 0.5-1.0 points.`,
  }
}

/**
 * Generates a deeper strategic plan (simulates LLM strategy generation)
 */
function generateStrategyPlan(dimensions, intake) {
  const sorted = [...dimensions].filter((d) => d.score !== null).sort((a, b) => a.score - b.score)
  const weakest = sorted.slice(0, 3)

  return {
    executive: `Strategic improvement plan for ${intake?.companyName || 'the company'} targeting a 1.0+ point increase in overall score within 6 months.`,
    phases: [
      {
        name: 'Phase 1: Quick Wins (0-30 days)',
        items: weakest.map((d) => `${d.name}: Begin immediate action on lowest-hanging fruit`),
      },
      {
        name: 'Phase 2: Foundation (30-90 days)',
        items: [
          'Establish measurement systems for each target dimension',
          'Hire/assign owners for each improvement initiative',
          'Set quarterly targets with leading indicators',
        ],
      },
      {
        name: 'Phase 3: Execution (90-180 days)',
        items: [
          'Execute primary strategy for top 2 weakest dimensions',
          'Re-evaluate scores monthly to track progress',
          'Adjust resource allocation based on early results',
        ],
      },
    ],
    targetScore: (dimensions.reduce((sum, d) => sum + (d.score || 0), 0) / dimensions.length + 1.0).toFixed(1),
  }
}

export default function Recommendations({ scorecard, intake }) {
  const [showStrategy, setShowStrategy] = useState(false)
  const [strategy, setStrategy] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!scorecard) return null

  const recs = generateRecommendations(scorecard.dimensions)

  function handleStrategize() {
    setLoading(true)
    // Simulate LLM thinking time
    setTimeout(() => {
      setStrategy(generateStrategyPlan(scorecard.dimensions, intake))
      setShowStrategy(true)
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      {/* Recommendations Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="text-lg font-semibold text-[#f1f5f9]">Suggested Next Steps</h3>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleStrategize}
          loading={loading}
          disabled={showStrategy}
        >
          {showStrategy ? '✓ Strategy Generated' : '⚡ Strategize'}
        </Button>
      </div>

      {/* Overall Strategy Line */}
      <p className="text-sm text-[#94a3b8] bg-[#111827] rounded-lg px-4 py-3 border border-[#1e293b]">
        {recs.overallStrategy}
      </p>

      {/* Strengths */}
      {recs.strengths.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#4b5563]">Strengths:</span>
          {recs.strengths.map((name) => (
            <span key={name} className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              {name}
            </span>
          ))}
        </div>
      )}

      {/* Weak Dimension Recommendations */}
      {recs.weakDimensions.length > 0 && (
        <div className="space-y-3">
          {recs.weakDimensions.map((dim, i) => (
            <Card
              key={dim.name}
              className="animate-fade-in-up !p-4"
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-medium text-[#f1f5f9]">{dim.name}</h4>
                  <span className="text-xs text-amber-400">Score: {dim.score}/10 — needs improvement</span>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  dim.priority === 'high'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {dim.priority} priority
                </span>
              </div>
              <ul className="space-y-2">
                {dim.actions.map((action, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-[#cbd5e1]">
                    <span className="text-cyan-400 mt-0.5 flex-shrink-0">→</span>
                    {action}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {/* Strategy Plan (shown after clicking Strategize) */}
      {showStrategy && strategy && (
        <div className="mt-6 space-y-4 animate-fade-in-up">
          <Card glowing className="!border-cyan-500/20">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h4 className="text-sm font-semibold text-[#f1f5f9] uppercase tracking-wider">
                Strategic Improvement Plan
              </h4>
            </div>

            <p className="text-sm text-[#94a3b8] mb-4">{strategy.executive}</p>
            <p className="text-xs text-cyan-400 mb-4">Target score: {strategy.targetScore}/10 (+1.0 improvement)</p>

            {strategy.phases.map((phase, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <h5 className="text-sm font-medium text-[#f1f5f9] mb-2">{phase.name}</h5>
                <ul className="space-y-1.5 ml-4">
                  {phase.items.map((item, j) => (
                    <li key={j} className="text-sm text-[#cbd5e1] list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  )
}
