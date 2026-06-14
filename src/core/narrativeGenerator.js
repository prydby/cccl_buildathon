/**
 * Narrative Generator
 *
 * Produces an executive-summary narrative from a completed assessment.
 * Deterministic and always consistent with the computed scores/verdict —
 * no hardcoded prose that can drift from the engine output.
 *
 * @module core/narrativeGenerator
 */

const VERDICT_OPENER = {
  GO: 'is ready to scale from pilot to production.',
  CONDITIONAL: 'shows a sound foundation but needs focused work before scaling.',
  NO_GO: 'is not yet ready for production scale.',
}

/**
 * Builds a multi-paragraph narrative.
 * @param {Object} args
 * @param {Object} args.intake
 * @param {Object} args.scorecard
 * @param {Object} args.trl
 * @param {Object} args.gaps
 * @returns {string}
 */
export function generateNarrative({ intake, scorecard, trl, gaps }) {
  const name = intake.name
  const dims = [...scorecard.dimensions].sort((a, b) => b.score - a.score)
  const strengths = dims.filter((d) => d.score >= 7.5)
  const { blocking, warnings } = gaps

  const paras = []

  // Para 1 — headline
  paras.push(
    `${name} ${VERDICT_OPENER[trl.verdict]} It scores ${scorecard.overall}/10 overall, placing it at TRL ${trl.level} (${trl.label}), assessed under the ${scorecard.framework.name} framework.`
  )

  // Para 2 — strengths
  if (strengths.length > 0) {
    const top = strengths.slice(0, 2).map((d) => `${d.name} (${d.score})`).join(' and ')
    paras.push(`Its strongest areas are ${top}. These are solid foundations to build on.`)
  }

  // Para 3 — gaps
  if (blocking.length > 0) {
    const list = blocking.map((g) => `${g.name} (${g.score})`).join(', ')
    paras.push(
      `Critical gaps block production readiness: ${list}. These score below the minimum threshold and must be addressed before scaling — they are the kind of gaps that surface as incidents under load.`
    )
  }
  if (warnings.length > 0) {
    const list = warnings.map((g) => g.name).join(', ')
    paras.push(`Areas needing improvement (not blocking, but address before scale): ${list}.`)
  }

  // Para 4 — verdict + timeline
  if (trl.verdict === 'GO') {
    paras.push('Recommendation: proceed to production with standard monitoring in place.')
  } else {
    paras.push(
      `Recommendation: ${trl.verdict === 'NO_GO' ? 'do not scale yet' : 'proceed with a remediation plan'}. Estimated ${trl.estimatedWeeks} weeks of focused work to reach a clean GO verdict.`
    )
  }

  return paras.join('\n\n')
}

export default generateNarrative
