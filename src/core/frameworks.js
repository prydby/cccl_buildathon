/**
 * Framework Definitions & Selection
 *
 * Each framework defines a set of axes. Each axis carries:
 *  - scoring signals (positive / negative / strong keywords)
 *  - weight, rubric, industry benchmark, remediation steps
 *
 * The framework applied is selected by product type.
 * @module core/frameworks
 */

/**
 * Shared axis library. Frameworks compose from these.
 * Each axis has `signals` used by the deterministic scorer.
 */
const AXIS_LIBRARY = {
  architecture: {
    id: 'architecture',
    name: 'System Architecture',
    icon: '🏗️',
    framework: 'AWS Well-Architected + ThoughtWorks Fitness Functions',
    description: 'Modularity, service boundaries, evolvability',
    signals: {
      strong: ['microservice', 'event-driven', 'modular', 'service mesh', 'domain-driven', 'hexagonal', 'clean architecture', 'kubernetes', 'serverless'],
      positive: ['api', 'service', 'architecture', 'decoupled', 'scalable design', 'separation of concern', 'layered', 'stateless'],
      negative: ['monolith', 'tightly coupled', 'spaghetti', 'no architecture', 'tech debt', 'legacy', 'hardcoded'],
    },
    benchmark: 'Top quartile: documented service boundaries, contract testing, evolvable design with fitness functions.',
    remediation: [
      'Document service boundaries and dependency map',
      'Introduce contract testing between services',
      'Define architecture fitness functions for evolvability',
    ],
  },
  reliability: {
    id: 'reliability',
    name: 'Reliability & Resilience',
    icon: '🛡️',
    framework: 'Google SRE + Chaos Engineering',
    description: 'Failure handling, graceful degradation, SLOs',
    signals: {
      strong: ['circuit breaker', 'graceful degradation', 'slo', 'sla', 'chaos', 'failover', 'redundancy', 'high availability', 'self-healing', 'retry with backoff'],
      positive: ['health check', 'retry', 'fallback', 'monitoring', 'uptime', 'resilient', 'error handling', 'timeout'],
      negative: ['single point of failure', 'no slo', 'no failover', 'cascade', 'no redundancy', 'crashes', 'downtime', 'no error handling'],
    },
    benchmark: 'Production systems maintain 99.95% uptime with circuit breakers and graceful degradation on dependency failure.',
    remediation: [
      'Define SLOs and error budgets for critical paths',
      'Implement circuit breakers on all external dependencies',
      'Add graceful degradation (cached/partial results on failure)',
    ],
  },
  delivery: {
    id: 'delivery',
    name: 'Delivery Velocity',
    icon: '🔄',
    framework: 'DORA Four Key Metrics',
    description: 'CI/CD maturity, deployment frequency, rollback',
    signals: {
      strong: ['continuous deployment', 'feature flag', 'canary', 'blue-green', 'argocd', 'gitops', 'instant rollback', 'multiple times a day', 'trunk-based'],
      positive: ['ci/cd', 'github actions', 'pipeline', 'automated deploy', 'rollback', 'jenkins', 'gitlab ci', 'weekly release'],
      negative: ['manual deploy', 'no ci', 'no pipeline', 'ad-hoc deploy', 'no rollback', 'monthly release', 'manual release'],
    },
    benchmark: 'DORA Elite: multiple deploys/day, <1h lead time, <5% change failure rate, feature flags for instant rollback.',
    remediation: [
      'Implement feature flags for decoupled releases and instant rollback',
      'Add canary or blue-green deployment strategy',
      'Separate config/prompt deploys from code deploys',
    ],
  },
  observability: {
    id: 'observability',
    name: 'Observability & Monitoring',
    icon: '👁️',
    framework: 'Google SRE + OpenTelemetry',
    description: 'Tracing, metrics, dashboards, alerting',
    signals: {
      strong: ['distributed tracing', 'opentelemetry', 'datadog', 'grafana', 'prometheus', 'jaeger', 'honeycomb', 'real-time dashboard', 'slo alerting', 'langfuse', 'arize'],
      positive: ['monitoring', 'logging', 'metrics', 'cloudwatch', 'dashboard', 'alert', 'observability', 'trace'],
      negative: ['no monitoring', 'no tracing', 'no observability', 'flying blind', 'basic logging only', 'no dashboard', 'no alert', 'no metrics'],
    },
    benchmark: 'Production requires request-level distributed tracing, business dashboards, and SLO-based automated alerting.',
    remediation: [
      'Deploy distributed tracing (OpenTelemetry / Langfuse for LLM apps)',
      'Build real-time business metrics dashboards',
      'Set up SLO-based automated alerting',
    ],
  },
  security: {
    id: 'security',
    name: 'Security & Data Privacy',
    icon: '🔒',
    framework: 'OWASP + AWS Security Pillar',
    description: 'Auth, encryption, secrets, compliance',
    signals: {
      strong: ['encryption at rest', 'kms', 'vault', 'soc2', 'gdpr', 'pen test', 'penetration test', 'mtls', 'zero trust', 'secrets management', 'dpdpa'],
      positive: ['oauth', 'authentication', 'tls', 'https', 'encrypted', 'rbac', 'authorization', 'dependency scanning'],
      negative: ['no encryption', 'plain text', 'hardcoded secret', 'hardcoded key', 'no auth', 'unencrypted', 'no compliance', 'env var secret'],
    },
    benchmark: 'Sensitive-data services require encryption at rest (AES-256), secrets vault, compliance certification, and regular pen testing.',
    remediation: [
      'Encrypt sensitive data at rest (AES-256)',
      'Move secrets to a vault (HashiCorp Vault / AWS KMS)',
      'Establish data retention policy and compliance certification',
    ],
  },
  scalability: {
    id: 'scalability',
    name: 'Scalability Profile',
    icon: '📈',
    framework: 'AWS Well-Architected (Performance Pillar)',
    description: 'Load capacity, scaling strategy, cost at scale',
    signals: {
      strong: ['load test', 'auto-scaling', 'horizontal scaling', 'sharding', 'read replica', 'cdn', 'caching strategy', 'rate limiting', 'queue', 'load tested to'],
      positive: ['scalable', 'cache', 'redis', 'scaling', 'capacity', 'throughput', 'concurrent'],
      negative: ['single instance', 'no load test', 'not tested at scale', 'bottleneck', 'no scaling', 'no caching', 'rate limit issue'],
    },
    benchmark: 'Pre-scale-launch requires validated load tests at 10-20x target, database scaling strategy, and per-dependency rate budgets.',
    remediation: [
      'Run load tests at 10-20x current capacity',
      'Define database scaling strategy (replicas/sharding)',
      'Implement semantic caching and rate-limit budgets',
    ],
  },
  testing: {
    id: 'testing',
    name: 'Testing Maturity',
    icon: '🧪',
    framework: 'Testing Pyramid + Google PRR',
    description: 'Coverage, regression, edge cases, chaos',
    signals: {
      strong: ['e2e test', 'load test', 'chaos test', 'regression test', '80% coverage', '90% coverage', 'integration test', 'contract test', 'adversarial test'],
      positive: ['unit test', 'test coverage', 'automated test', 'ci test', 'testing', 'qa'],
      negative: ['no test', 'no coverage', 'manual test only', 'untested', 'no qa', 'low coverage'],
    },
    benchmark: 'Pre-production: 80%+ coverage, integration + E2E tests, chaos testing, documented edge cases.',
    remediation: [
      'Raise unit coverage to 80%+ on critical paths',
      'Add E2E and integration test suites',
      'Introduce chaos/failure-injection testing',
    ],
  },
  observability_ai: {
    id: 'observability_ai',
    name: 'AI Observability & Evals',
    icon: '👁️',
    framework: 'MLOps Maturity + LLM Eval Practices',
    description: 'LLM tracing, eval suites, cost & token tracking',
    signals: {
      strong: ['eval suite', 'llm tracing', 'langfuse', 'arize', 'model monitoring', 'drift detection', 'a/b test', 'eval framework', 'token tracking', 'cost dashboard'],
      positive: ['eval', 'monitoring', 'logging', 'metrics', 'quality metric', 'feedback'],
      negative: ['no eval', 'no tracing', 'manual spot-check', 'no cost tracking', 'no monitoring', 'flying blind'],
    },
    benchmark: 'Production AI requires LLM tracing, automated eval suites, drift detection, and real-time cost/token dashboards.',
    remediation: [
      'Build an automated eval suite (50+ cases) for quality regression',
      'Deploy LLM tracing (Langfuse / Arize)',
      'Add cost/token tracking with budget alerts',
    ],
  },
  safety_ai: {
    id: 'safety_ai',
    name: 'AI Safety & Guardrails',
    icon: '🛡️',
    framework: 'OWASP AI Top 10 + Anthropic RSP',
    description: 'Input/output guardrails, injection resistance, HITL',
    signals: {
      strong: ['guardrail', 'output validation', 'schema validation', 'prompt injection', 'red team', 'human-in-the-loop', 'content filter', 'jailbreak', 'pii masking', 'hallucination'],
      positive: ['validation', 'filter', 'moderation', 'safety', 'escalation', 'review'],
      negative: ['no validation', 'no guardrail', 'no filter', 'raw output', 'no safety', 'no review'],
    },
    benchmark: 'Production AI requires multi-layer I/O guardrails, regular red-teaming, PII handling, and human escalation paths.',
    remediation: [
      'Add schema validation on all LLM outputs',
      'Implement multi-layer input/output guardrails',
      'Schedule regular adversarial/red-team testing',
    ],
  },
  pmf: {
    id: 'pmf',
    name: 'Product-Market Signal',
    icon: '📊',
    framework: 'PMF Indicators + NASA TRL (operational validation)',
    description: 'Adoption, retention, engagement, satisfaction',
    signals: {
      strong: ['retention', 'nps', 'product-market fit', 'organic growth', 'dau', 'mau', 'churn', 'engagement', 'daily active', 'paying user'],
      positive: ['users', 'pilot', 'feedback', 'adoption', 'active', 'customer', 'usage'],
      negative: ['no users', 'no traction', 'no feedback', 'no metrics', 'unvalidated', 'no adoption'],
    },
    benchmark: 'Scale-ready signal: D7 retention >35%, weekly usage >2x, NPS >50, organic growth.',
    remediation: [
      'Instrument systematic feedback capture (not ad-hoc)',
      'Track retention cohorts and churn reasons',
      'Set up A/B testing infrastructure',
    ],
  },
}

/**
 * Frameworks compose axes with weights.
 * Weights within a framework sum to 1.0.
 */
export const FRAMEWORKS = {
  'platform-scale-readiness': {
    id: 'platform-scale-readiness',
    name: 'Platform Scale Readiness (PSR)',
    appliesTo: ['Consumer App', 'Marketplace / Aggregator'],
    sources: ['Google SRE PRR', 'Amazon ORR', 'DORA Metrics', 'AWS Well-Architected', 'ISO 25010', 'ThoughtWorks Fitness Functions'],
    axes: [
      { ...AXIS_LIBRARY.architecture, weight: 0.15 },
      { ...AXIS_LIBRARY.reliability, weight: 0.18 },
      { ...AXIS_LIBRARY.delivery, weight: 0.12 },
      { ...AXIS_LIBRARY.observability, weight: 0.15 },
      { ...AXIS_LIBRARY.security, weight: 0.13 },
      { ...AXIS_LIBRARY.scalability, weight: 0.12 },
      { ...AXIS_LIBRARY.testing, weight: 0.08 },
      { ...AXIS_LIBRARY.pmf, weight: 0.07 },
    ],
  },
  'agent-readiness-model': {
    id: 'agent-readiness-model',
    name: 'Agent Readiness Model (ARM)',
    appliesTo: ['AI Agent / MCP Tool'],
    sources: ['Anthropic RSP', 'Google MLOps Maturity', 'OWASP AI Top 10', 'Google SRE PRR', 'DORA Metrics'],
    axes: [
      { ...AXIS_LIBRARY.architecture, weight: 0.15 },
      { ...AXIS_LIBRARY.reliability, weight: 0.12 },
      { ...AXIS_LIBRARY.delivery, weight: 0.10 },
      { ...AXIS_LIBRARY.observability_ai, weight: 0.16 },
      { ...AXIS_LIBRARY.safety_ai, weight: 0.16 },
      { ...AXIS_LIBRARY.scalability, weight: 0.11 },
      { ...AXIS_LIBRARY.testing, weight: 0.10 },
      { ...AXIS_LIBRARY.pmf, weight: 0.10 },
    ],
  },
  'saas-production-readiness': {
    id: 'saas-production-readiness',
    name: 'SaaS Production Readiness (SPR)',
    appliesTo: ['SaaS Platform', 'API / Platform Service'],
    sources: ['AWS Well-Architected', 'DORA Metrics', 'ISO 25010', 'Google SRE PRR'],
    axes: [
      { ...AXIS_LIBRARY.architecture, weight: 0.16 },
      { ...AXIS_LIBRARY.reliability, weight: 0.16 },
      { ...AXIS_LIBRARY.delivery, weight: 0.14 },
      { ...AXIS_LIBRARY.observability, weight: 0.15 },
      { ...AXIS_LIBRARY.security, weight: 0.15 },
      { ...AXIS_LIBRARY.scalability, weight: 0.12 },
      { ...AXIS_LIBRARY.testing, weight: 0.12 },
    ],
  },
  'general-production-readiness': {
    id: 'general-production-readiness',
    name: 'General Production Readiness (GPR)',
    appliesTo: ['Data Pipeline / MLOps', 'Infrastructure / DevTool', 'Other'],
    sources: ['Google SRE PRR', 'DORA Metrics', 'AWS Well-Architected', 'NASA TRL'],
    axes: [
      { ...AXIS_LIBRARY.architecture, weight: 0.18 },
      { ...AXIS_LIBRARY.reliability, weight: 0.17 },
      { ...AXIS_LIBRARY.delivery, weight: 0.15 },
      { ...AXIS_LIBRARY.observability, weight: 0.17 },
      { ...AXIS_LIBRARY.security, weight: 0.15 },
      { ...AXIS_LIBRARY.testing, weight: 0.18 },
    ],
  },
}

/**
 * Selects the appropriate framework for a product type.
 * @param {string} productType
 * @returns {Object} framework definition
 */
export function selectFramework(productType) {
  for (const fw of Object.values(FRAMEWORKS)) {
    if (fw.appliesTo.includes(productType)) return fw
  }
  return FRAMEWORKS['general-production-readiness']
}

export { AXIS_LIBRARY }
export default FRAMEWORKS
