import { describe, it, expect } from 'vitest'
import { runAssessment, selectFramework, FRAMEWORKS } from '../index.js'
import { extractAxisSignals } from '../signalExtractor.js'

describe('framework selection', () => {
  it('routes AI agents to ARM', () => {
    expect(selectFramework('AI Agent / MCP Tool').id).toBe('agent-readiness-model')
  })
  it('routes SaaS and API to SPR', () => {
    expect(selectFramework('SaaS Platform').id).toBe('saas-production-readiness')
    expect(selectFramework('API / Platform Service').id).toBe('saas-production-readiness')
  })
  it('routes consumer/marketplace to PSR', () => {
    expect(selectFramework('Consumer App').id).toBe('platform-scale-readiness')
    expect(selectFramework('Marketplace / Aggregator').id).toBe('platform-scale-readiness')
  })
  it('falls back to GPR for unknown types', () => {
    expect(selectFramework('Something Else').id).toBe('general-production-readiness')
  })
})

describe('framework integrity', () => {
  it('every framework has weights summing to 1.0', () => {
    for (const fw of Object.values(FRAMEWORKS)) {
      const sum = fw.axes.reduce((s, a) => s + a.weight, 0)
      expect(Math.abs(sum - 1.0)).toBeLessThan(0.001)
    }
  })
})

describe('scoring invariants', () => {
  const strongDoc =
    'distributed tracing, SLO, circuit breaker, encryption at rest, KMS, load tested to 20x, 85% coverage, chaos testing, feature flags, canary, e2e tests, integration tests, auto-scaling'
  const weakDoc =
    'monolith, no monitoring, no tests, hardcoded secrets, single instance, manual deploy'

  it('strong document scores higher than weak document', () => {
    const strong = runAssessment({ name: 'A', productType: 'SaaS Platform', document: strongDoc })
    const weak = runAssessment({ name: 'B', productType: 'SaaS Platform', document: weakDoc })
    expect(strong.scorecard.overall).toBeGreaterThan(weak.scorecard.overall)
  })

  it('strong document earns GO, weak earns NO_GO', () => {
    const strong = runAssessment({ name: 'A', productType: 'SaaS Platform', document: strongDoc })
    const weak = runAssessment({ name: 'B', productType: 'SaaS Platform', document: weakDoc })
    expect(strong.trl.verdict).toBe('GO')
    expect(weak.trl.verdict).toBe('NO_GO')
  })

  it('scores are clamped to [1,10]', () => {
    const a = runAssessment({ name: 'A', productType: 'SaaS Platform', document: strongDoc })
    for (const d of a.scorecard.dimensions) {
      expect(d.score).toBeGreaterThanOrEqual(1)
      expect(d.score).toBeLessThanOrEqual(10)
    }
  })
})

describe('negation awareness', () => {
  const axis = {
    id: 'x',
    signals: {
      strong: ['distributed tracing'],
      positive: ['monitoring'],
      negative: ['no slo'],
    },
  }
  it('treats "no distributed tracing" as a gap, not a strength', () => {
    const s = extractAxisSignals('we have no distributed tracing in the system', axis)
    expect(s.strong).toBe(0)
    expect(s.negative).toBeGreaterThan(0)
    expect(s.missingEvidence).toContain('no distributed tracing')
  })
  it('counts genuine "distributed tracing" as a strength', () => {
    const s = extractAxisSignals('we use distributed tracing across services', axis)
    expect(s.strong).toBe(1)
    expect(s.foundEvidence).toContain('distributed tracing')
  })
})

describe('input validation', () => {
  it('throws when name is missing', () => {
    expect(() => runAssessment({ productType: 'SaaS Platform', document: 'x'.repeat(60) })).toThrow()
  })
  it('throws when document is too short', () => {
    expect(() => runAssessment({ name: 'A', productType: 'SaaS Platform', document: 'short' })).toThrow()
  })
})

describe('output completeness', () => {
  it('returns framework, scorecard, trl, gaps, and narrative', () => {
    const a = runAssessment({
      name: 'A',
      productType: 'SaaS Platform',
      document: 'distributed tracing, SLO, tests, encryption at rest, monitoring, ci/cd',
    })
    expect(a.framework).toBeTruthy()
    expect(a.scorecard.dimensions.length).toBeGreaterThan(0)
    expect(a.trl.verdict).toMatch(/GO|CONDITIONAL|NO_GO/)
    expect(a.gaps).toBeTruthy()
    expect(typeof a.narrative).toBe('string')
    expect(a.narrative.length).toBeGreaterThan(0)
  })
})
