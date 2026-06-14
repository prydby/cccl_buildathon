import React from 'react'
import Card from './ui/Card.jsx'

export default function AboutPage() {
  return (
    <div className="space-y-8 animate-fade-in-up max-w-4xl">
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-extrabold text-[#f1f5f9] tracking-tight">
          Pilot<span className="text-cyan-400">IQ</span>
        </h1>
        <p className="mt-3 text-lg text-[#94a3b8] max-w-2xl mx-auto">
          AI-powered evaluation intelligence for companies and products.
          Make faster, more consistent decisions with structured frameworks.
        </p>
      </div>

      {/* What is PilotIQ */}
      <Card glowing>
        <h2 className="text-xl font-bold text-[#f1f5f9] mb-4">What is PilotIQ?</h2>
        <p className="text-sm text-[#cbd5e1] leading-relaxed mb-4">
          PilotIQ is a decision intelligence platform that evaluates companies and products across 
          structured, research-backed frameworks. Instead of relying on gut feel and spreadsheets, 
          PilotIQ gives you consistent, explainable scores in seconds.
        </p>
        <p className="text-sm text-[#cbd5e1] leading-relaxed">
          Whether you're an investor evaluating dealflow, a product manager assessing opportunities, 
          or a founder benchmarking against competitors — PilotIQ is your structured evaluation co-pilot.
        </p>
      </Card>

      {/* How it works */}
      <div>
        <h2 className="text-xl font-bold text-[#f1f5f9] mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-sm font-semibold text-[#f1f5f9] mb-2">1. Input</h3>
            <p className="text-xs text-[#94a3b8]">
              Enter company or product details — name, description, metrics. Takes 30 seconds.
            </p>
          </Card>
          <Card>
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="text-sm font-semibold text-[#f1f5f9] mb-2">2. AI Evaluation</h3>
            <p className="text-xs text-[#94a3b8]">
              Our engine scores across 7 dimensions using AI. Each score comes with reasoning and confidence.
            </p>
          </Card>
          <Card>
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-sm font-semibold text-[#f1f5f9] mb-2">3. Actionable Results</h3>
            <p className="text-xs text-[#94a3b8]">
              Get a visual scorecard, radar chart, narrative summary, and strategic recommendations.
            </p>
          </Card>
        </div>
      </div>

      {/* The 7 Dimensions */}
      <div>
        <h2 className="text-xl font-bold text-[#f1f5f9] mb-4">The 7-Dimension Framework</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { icon: '🎯', name: 'Market Opportunity', weight: '15%', desc: 'TAM, growth trajectory, market timing' },
            { icon: '💎', name: 'Product Differentiation', weight: '15%', desc: 'Uniqueness, IP, switching costs' },
            { icon: '👥', name: 'Team & Execution', weight: '20%', desc: 'Experience, velocity, track record' },
            { icon: '💰', name: 'Financial Health', weight: '15%', desc: 'Revenue quality, burn efficiency, runway' },
            { icon: '📈', name: 'Scalability', weight: '15%', desc: 'Unit economics, automation, leverage' },
            { icon: '🏰', name: 'Competitive Moat', weight: '10%', desc: 'Network effects, defensibility' },
            { icon: '⚠️', name: 'Risk Profile', weight: '10%', desc: 'Concentration, mitigation strategies' },
          ].map((dim) => (
            <div key={dim.name} className="flex items-start gap-3 bg-[#111827] rounded-lg p-3 border border-[#1e293b]">
              <span className="text-xl">{dim.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#f1f5f9]">{dim.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{dim.weight}</span>
                </div>
                <p className="text-xs text-[#64748b] mt-0.5">{dim.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div>
        <h2 className="text-xl font-bold text-[#f1f5f9] mb-4">Who Uses PilotIQ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">🏦 Investors & VCs</h3>
            <p className="text-xs text-[#94a3b8]">First-pass evaluation of dealflow. Screen 100+ companies with consistent scoring instead of gut feel.</p>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">🚀 Accelerators</h3>
            <p className="text-xs text-[#94a3b8]">Score cohort applicants fairly and consistently. Compare across batches with standardized metrics.</p>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">📱 Product Teams</h3>
            <p className="text-xs text-[#94a3b8]">Evaluate build-vs-buy decisions, market opportunities, and product-market fit with structured analysis.</p>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">🏢 Corporate Innovation</h3>
            <p className="text-xs text-[#94a3b8]">Assess partnership opportunities, acquisition targets, and new market entries with data-backed frameworks.</p>
          </Card>
        </div>
      </div>

      {/* Tech Stack */}
      <Card>
        <h2 className="text-lg font-bold text-[#f1f5f9] mb-3">Built With</h2>
        <div className="flex flex-wrap gap-2">
          {['React', 'Vite', 'Tailwind CSS', 'Recharts', 'Claude AI', 'Node.js'].map((tech) => (
            <span key={tech} className="px-3 py-1 text-xs rounded-full bg-[#1e293b] text-[#94a3b8] border border-[#334155]">
              {tech}
            </span>
          ))}
        </div>
      </Card>
    </div>
  )
}
