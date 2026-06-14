import React from 'react'
import Card from './ui/Card.jsx'

export default function AboutMe() {
  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl">
      {/* Profile Header */}
      <div className="flex items-center gap-6 py-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-cyan-500/20">
          P
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#f1f5f9]">Priya</h1>
          <p className="text-sm text-[#94a3b8] mt-1">Builder • Problem Solver • Tech Enthusiast</p>
          <div className="flex gap-3 mt-3">
            <a href="https://github.com/prydby" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
              GitHub ↗
            </a>
          </div>
        </div>
      </div>

      {/* About */}
      <Card glowing>
        <h2 className="text-lg font-bold text-[#f1f5f9] mb-3">About This Project</h2>
        <p className="text-sm text-[#cbd5e1] leading-relaxed mb-3">
          PilotIQ was built during a buildathon sprint to solve a real problem: the lack of structured, 
          consistent evaluation frameworks for companies and products.
        </p>
        <p className="text-sm text-[#cbd5e1] leading-relaxed mb-3">
          Every investor, accelerator, and product team evaluates opportunities differently. 
          PilotIQ standardizes this with a 7-dimension AI-powered framework that gives 
          explainable, actionable scores in seconds.
        </p>
        <p className="text-sm text-[#cbd5e1] leading-relaxed">
          Built with React, Tailwind CSS, and Claude AI — designed to be extensible, 
          provider-agnostic, and production-ready from day one.
        </p>
      </Card>

      {/* What I Built */}
      <div>
        <h2 className="text-lg font-bold text-[#f1f5f9] mb-3">What I Built</h2>
        <div className="space-y-3">
          {[
            { label: 'Scoring Engine', desc: 'Multi-dimensional evaluation with parallel fan-out, typed errors, and strategy pattern for provider swapping' },
            { label: 'UI/UX', desc: 'Dark Bloomberg-terminal aesthetic with animated radar charts, score count-ups, and staggered card entrances' },
            { label: 'AI Assistant', desc: 'In-app conversational assistant that explains dimensions, guides usage, and answers questions' },
            { label: 'Dual Evaluation', desc: 'Both company-level and product-level evaluation modes with tailored frameworks' },
            { label: 'Strategic Recommendations', desc: 'Actionable next steps with priority ranking and phased improvement plans' },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 bg-[#111827] rounded-lg p-4 border border-[#1e293b]">
              <span className="text-cyan-400 mt-0.5">◆</span>
              <div>
                <span className="text-sm font-medium text-[#f1f5f9]">{item.label}</span>
                <p className="text-xs text-[#64748b] mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Highlights */}
      <Card>
        <h2 className="text-lg font-bold text-[#f1f5f9] mb-3">Architecture Highlights</h2>
        <div className="space-y-2 text-sm text-[#94a3b8]">
          <p>• <strong className="text-[#f1f5f9]">Strategy Pattern</strong> — Swap LLM providers (OpenAI/Anthropic/Mock) without touching scoring logic</p>
          <p>• <strong className="text-[#f1f5f9]">Dependency Injection</strong> — Scorer receives its router, doesn't import it directly</p>
          <p>• <strong className="text-[#f1f5f9]">Config-Driven</strong> — Add a dimension = add a JSON entry, zero code changes</p>
          <p>• <strong className="text-[#f1f5f9]">Fan-Out Scoring</strong> — All 7 dimensions evaluated in parallel (horizontally scalable)</p>
          <p>• <strong className="text-[#f1f5f9]">Cache Fallback</strong> — Graceful degradation when API is unavailable</p>
          <p>• <strong className="text-[#f1f5f9]">Typed Errors</strong> — RateLimitError, APIError, TimeoutError hierarchy</p>
        </div>
      </Card>
    </div>
  )
}
