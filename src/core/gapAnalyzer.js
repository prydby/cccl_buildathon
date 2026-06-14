/**
 * Gap Analyzer
 *
 * Identifies axes below threshold, ranks by severity, and produces
 * remediation steps (sourced from the axis definition) and a phased roadmap.
 * @module core/gapAnalyzer
 */

import { FRAMEWORKS } from './frameworks.js'

/**
 * Finds the axis definition (with remediation) by id across frameworks.
 */
function findAxisDef(axisId) {
  for (const fw of Object.values(FRAMEWORKS)) {
    const axis = fw.axes.find((a) => a.id === axisId)
    if (axis) return axis
  }
  return null
}

/**
 * Analyzes gaps from a scorecard.
 * @param {Object} scorecard - { dimensions }
 * @returns {Object} { gaps, roadmap }
 */
export function analyzeGaps(scorecard) {
  const gaps = scorecard.dimensions
    .filter((d) => d.score < 7)
    .sort((a, b) => a.score - b.score)
    .map((d) => {
      const def = findAxisDef(d.id)
      return {
        name: d.name,
        score: d.score,
        severity: d.score < 5 ? 'blocking' : 'warning',
        reasoning: d.reasoning,
        benchmark: d.benchmark,
        remediation: def?.remediation || ['Investigate and address this axis.'],
      }
    })

  const blocking = gaps.filter((g) => g.severity === 'blocking')
  const warnings = gaps.filter((g) => g.severity === 'warning')

  const roadmap = [
    {
      phase: 1,
      name: 'Critical Gaps',
      window: 'Week 1-3',
      severity: 'blocking',
      items: blocking.flatMap((g) => g.remediation.slice(0, 2).map((r) => `${g.name}: ${r}`)),
    },
    {
      phase: 2,
      name: 'Warnings',
      window: 'Week 3-5',
      severity: 'warning',
      items: warnings.flatMap((g) => g.remediation.slice(0, 1).map((r) => `${g.name}: ${r}`)),
    },
    {
      phase: 3,
      name: 'Validation',
      window: 'Week 5-6',
      severity: 'validation',
      items: ['Re-assess with PilotIQ', 'Load test at target scale', 'Stakeholder sign-off'],
    },
  ].filter((p) => p.items.length > 0)

  return { gaps, blocking, warnings, roadmap }
}

export default analyzeGaps
