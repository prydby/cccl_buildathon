/**
 * Seven-Dimension Scoring Framework
 * Config-driven dimension definitions — add a dimension by adding an entry here.
 * No code changes required elsewhere.
 * @module dimensions
 */

/**
 * @typedef {Object} Dimension
 * @property {string} id - Unique identifier (kebab-case)
 * @property {string} name - Display name
 * @property {string} description - What this dimension evaluates
 * @property {number} weight - Scoring weight (all weights sum to 1.0)
 * @property {Object} rubric - Scoring guidelines
 * @property {string} rubric.low - Description for scores 1-3
 * @property {string} rubric.mid - Description for scores 4-6
 * @property {string} rubric.high - Description for scores 7-10
 * @property {string} promptTemplate - LLM prompt template with {{placeholder}} vars
 */

/** @type {Dimension[]} */
export const dimensions = [
  {
    id: 'market-opportunity',
    name: 'Market Opportunity',
    description: 'Size, growth trajectory, and accessibility of the target market',
    weight: 0.15,
    rubric: {
      low: '1-3: Niche market under $1B, declining or flat growth, high barriers to entry',
      mid: '4-6: Moderate market ($1-10B), steady 10-20% growth, some competition',
      high: '7-10: Large market ($10B+), strong growth (20%+), clear entry path with tailwinds',
    },
    promptTemplate: `Evaluate the market opportunity for {{companyName}} in the {{vertical}} space.
Consider: Total addressable market size, growth rate, market timing, and accessibility.
Company context: {{description}}
Key metrics: {{metrics}}
Provide a score from 1-10 and brief reasoning.`,
  },
  {
    id: 'product-differentiation',
    name: 'Product Differentiation',
    description: 'Uniqueness of the product and defensibility of its value proposition',
    weight: 0.15,
    rubric: {
      low: '1-3: Me-too product, easily replicable, no unique IP or data advantage',
      mid: '4-6: Some differentiation through UX or integrations, moderate switching costs',
      high: '7-10: Strong unique value prop, proprietary tech/data, high switching costs',
    },
    promptTemplate: `Evaluate the product differentiation for {{companyName}} in the {{vertical}} space.
Consider: Uniqueness of approach, IP/data moats, switching costs, and user experience advantages.
Company context: {{description}}
Key metrics: {{metrics}}
Provide a score from 1-10 and brief reasoning.`,
  },
  {
    id: 'team-execution',
    name: 'Team & Execution',
    description: 'Quality of the team and their demonstrated ability to execute',
    weight: 0.20,
    rubric: {
      low: '1-3: Inexperienced team, poor execution track record, key gaps in leadership',
      mid: '4-6: Competent team with some relevant experience, adequate execution pace',
      high: '7-10: Exceptional team with domain expertise, prior exits, and fast execution',
    },
    promptTemplate: `Evaluate the team and execution capability of {{companyName}}.
Consider: Founder experience, team composition, hiring velocity, execution speed, and operational track record.
Company context: {{description}}
Key metrics: Team size {{teamSize}}, Growth rate {{growth}}
Provide a score from 1-10 and brief reasoning.`,
  },
  {
    id: 'financial-health',
    name: 'Financial Health',
    description: 'Revenue quality, burn efficiency, and path to sustainability',
    weight: 0.15,
    rubric: {
      low: '1-3: Pre-revenue or declining, high burn with no clear path to profitability',
      mid: '4-6: Growing revenue, moderate burn, 12-18 month runway',
      high: '7-10: Strong revenue growth, efficient burn, clear path to profitability or funded',
    },
    promptTemplate: `Evaluate the financial health of {{companyName}}.
Consider: Revenue (ARR: {{arr}}), growth rate ({{growth}}), net revenue retention ({{nrr}}), burn rate, and runway.
Company context: {{description}}
Stage: {{stage}}
Provide a score from 1-10 and brief reasoning.`,
  },
  {
    id: 'scalability',
    name: 'Scalability',
    description: 'Ability to grow revenue without proportional cost increases',
    weight: 0.15,
    rubric: {
      low: '1-3: Linear cost scaling, heavy services dependency, manual processes required',
      mid: '4-6: Some automation, moderate scaling efficiency, expanding margins',
      high: '7-10: Platform economics, self-serve growth, strong operating leverage',
    },
    promptTemplate: `Evaluate the scalability of {{companyName}}'s business model.
Consider: Unit economics at scale, automation level, self-serve vs high-touch, infrastructure scalability.
Company context: {{description}}
Key metrics: {{customers}} customers, team size {{teamSize}}
Provide a score from 1-10 and brief reasoning.`,
  },
  {
    id: 'competitive-moat',
    name: 'Competitive Moat',
    description: 'Sustainability of competitive advantages over time',
    weight: 0.10,
    rubric: {
      low: '1-3: No defensibility, easily replicated, commoditized space',
      mid: '4-6: Moderate moat through brand, data, or relationships, but contestable',
      high: '7-10: Strong network effects, proprietary data/IP, regulatory advantages',
    },
    promptTemplate: `Evaluate the competitive moat for {{companyName}} in the {{vertical}} space.
Consider: Network effects, data advantages, IP protection, brand strength, regulatory moats, and switching costs.
Company context: {{description}}
Provide a score from 1-10 and brief reasoning.`,
  },
  {
    id: 'risk-profile',
    name: 'Risk Profile',
    description: 'Concentration of risks and quality of mitigation strategies',
    weight: 0.10,
    rubric: {
      low: '1-3: High concentration risk, single points of failure, no mitigation',
      mid: '4-6: Moderate diversification, identified risks with partial mitigation',
      high: '7-10: Well-diversified, risks identified and actively mitigated, resilient model',
    },
    promptTemplate: `Evaluate the risk profile for {{companyName}}.
Consider: Customer concentration, key person dependency, technology risk, market risk, regulatory exposure, and mitigation strategies.
Company context: {{description}}
Stage: {{stage}}, Customers: {{customers}}
Provide a score from 1-10 and brief reasoning.`,
  },
]

/**
 * Validates that dimension weights sum to 1.0
 * @returns {boolean}
 */
export function validateWeights() {
  const sum = dimensions.reduce((acc, d) => acc + d.weight, 0)
  return Math.abs(sum - 1.0) < 0.001
}

export default dimensions
