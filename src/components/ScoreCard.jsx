import React, { useState, useEffect } from 'react'
import Card from './ui/Card.jsx'

function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target === null || target === undefined) return
    const startTime = Date.now()
    function animate() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setValue(target * eased)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target, duration])

  return value
}

function getScoreColor(score) {
  if (score < 4) return { text: 'text-red-400', bg: 'bg-red-500', glow: 'glow-red' }
  if (score < 7) return { text: 'text-amber-400', bg: 'bg-amber-500', glow: 'glow-amber' }
  return { text: 'text-green-400', bg: 'bg-green-500', glow: 'glow-green' }
}

function DimensionCard({ dimension, index }) {
  const [expanded, setExpanded] = useState(false)
  const animatedScore = useCountUp(dimension.score, 800 + index * 100)
  const colors = dimension.score !== null ? getScoreColor(dimension.score) : { text: 'text-[#4b5563]', bg: 'bg-[#4b5563]' }

  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Card className="cursor-pointer hover:border-[#475569] transition-all" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-[#f1f5f9]">{dimension.name}</h4>
            {/* Confidence bar */}
            <div className="mt-2 h-1 w-full bg-[#0a0e17] rounded-full overflow-hidden">
              <div
                className={`h-full ${colors.bg} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${(dimension.confidence || 0) * 100}%` }}
              />
            </div>
            <p className="text-xs text-[#4b5563] mt-1">
              {Math.round((dimension.confidence || 0) * 100)}% confidence
            </p>
          </div>
          <div className={`text-2xl font-bold ${colors.text} ml-4`}>
            {dimension.score !== null ? animatedScore.toFixed(1) : '—'}
          </div>
        </div>

        {/* Expandable reasoning */}
        <div
          className={`expand-height ${expanded ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
        >
          <p className="text-xs text-[#94a3b8] leading-relaxed border-t border-[#1e293b] pt-3">
            {dimension.reasoning}
          </p>
        </div>

        {/* Expand indicator */}
        <div className="flex justify-center mt-2">
          <svg
            className={`w-4 h-4 text-[#4b5563] transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </Card>
    </div>
  )
}

export default function ScoreCard({ scorecard }) {
  const overallAnimated = useCountUp(scorecard?.overall, 1200)
  const colors = scorecard?.overall ? getScoreColor(scorecard.overall) : {}

  if (!scorecard) return null

  return (
    <div className="space-y-6">
      {/* Overall Score Hero */}
      <div className={`text-center py-8 rounded-2xl bg-[#111827] border border-[#1e293b] ${colors.glow}`}>
        <div className={`text-6xl font-bold ${colors.text} animate-count-up`}>
          {overallAnimated.toFixed(1)}
        </div>
        <p className="text-sm text-[#64748b] mt-2">Overall Score</p>
        <p className="text-xs text-[#4b5563] mt-1">
          {new Date(scorecard.timestamp).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </p>
        {scorecard.stale && (
          <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Cached result — may be stale
          </span>
        )}
      </div>

      {/* Dimension Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scorecard.dimensions.map((dim, i) => (
          <DimensionCard key={dim.name} dimension={dim} index={i} />
        ))}
      </div>
    </div>
  )
}
