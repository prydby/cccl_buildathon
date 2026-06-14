/**
 * Technology Readiness Level (TRL) Calculator
 *
 * Maps a scorecard to NASA TRL scale (1-9) and a GO/CONDITIONAL/NO-GO verdict.
 * @module core/trlCalculator
 */

const TRL_LABELS = {
  1: 'Basic principles observed',
  2: 'Concept formulated',
  3: 'Proof of concept',
  4: 'Lab validated',
  5: 'Validated in relevant environment',
  6: 'Demonstrated in relevant environment',
  7: 'Prototype in operational environment',
  8: 'System complete and qualified',
  9: 'Production-proven at scale',
}

/** Map overall score (1-10) → TRL level (1-9) */
function scoreToTRL(overall) {
  if (overall >= 9.3) return 9
  if (overall >= 8.5) return 8
  if (overall >= 7.5) return 7
  if (overall >= 6.5) return 6
  if (overall >= 5.5) return 5
  if (overall >= 4.5) return 4
  if (overall >= 3.5) return 3
  if (overall >= 2.0) return 2
  return 1
}

/**
 * Calculates TRL + verdict from a scorecard.
 * @param {Object} scorecard - { dimensions, overall }
 * @returns {Object} trl result
 */
export function calculateTRL(scorecard) {
  const { dimensions, overall } = scorecard

  const level = scoreToTRL(overall)
  const label = TRL_LABELS[level]

  const blockingGaps = dimensions.filter((d) => d.score < 5).map((d) => d.name)
  const warnings = dimensions.filter((d) => d.score >= 5 && d.score < 7).map((d) => d.name)

  let verdict, verdictReason
  if (blockingGaps.length > 0) {
    verdict = 'NO_GO'
    verdictReason = `${blockingGaps.length} critical gap${blockingGaps.length > 1 ? 's' : ''} below the minimum readiness threshold. These must be addressed before scaling.`
  } else if (warnings.length > 2 || overall < 6.5) {
    verdict = 'CONDITIONAL'
    verdictReason = `Foundations are sound but ${warnings.length} area${warnings.length !== 1 ? 's need' : ' needs'} improvement. Proceed with a focused remediation plan.`
  } else {
    verdict = 'GO'
    verdictReason = 'Meets production-readiness thresholds across all axes. Safe to scale with standard monitoring.'
  }

  const estimatedWeeks = Math.ceil(blockingGaps.length * 3 + warnings.length * 1.5)

  return { level, label, verdict, verdictReason, blockingGaps, warnings, estimatedWeeks }
}

export default calculateTRL
