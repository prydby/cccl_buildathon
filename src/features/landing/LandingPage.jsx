import React from 'react'
import Button from '../../shared/ui/Button.jsx'

export default function LandingPage({ onGetStarted, onDemo }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e17] relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-cyan-500/5 blur-[150px]" />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[#f1f5f9]">Pilot<span className="text-cyan-400">IQ</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onDemo} className="text-sm text-[#94a3b8] hover:text-cyan-400 transition-colors">
            Live Demo
          </button>
          <Button size="sm" onClick={onGetStarted}>Get Started</Button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-8 pb-20">
        <div className="max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111827] border border-[#1e293b] mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-[#94a3b8]">Framework auto-selected by product type • Evidence-based • Local-first</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-[#f1f5f9] leading-[1.1] tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Is your product ready<br />
            <span className="bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">for production?</span>
          </h1>

          <p className="mt-6 text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Feed PilotIQ your product documentation. Get a structured, evidence-based 
            production readiness assessment — using a framework dynamically selected from 
            12 industry-leading models.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Button size="lg" onClick={onGetStarted}>Assess My Product →</Button>
            <Button variant="secondary" size="lg" onClick={onDemo}>▶ Demo: RidePool AI</Button>
          </div>

          {/* How it works - 3 steps */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="bg-[#111827]/50 border border-[#1e293b] rounded-xl p-5">
              <div className="text-2xl mb-3">📄</div>
              <h3 className="text-sm font-semibold text-[#f1f5f9] mb-1">1. Feed Your Docs</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Paste your BRD, PRD, architecture overview, or system description. 
                The agent extracts signals — no forms to fill.
              </p>
            </div>
            <div className="bg-[#111827]/50 border border-[#1e293b] rounded-xl p-5">
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="text-sm font-semibold text-[#f1f5f9] mb-1">2. Framework Auto-Selected</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                PilotIQ detects your product type and selects the right assessment model. 
                AI agents, SaaS, data pipelines — each gets the framework that fits.
              </p>
            </div>
            <div className="bg-[#111827]/50 border border-[#1e293b] rounded-xl p-5">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="text-sm font-semibold text-[#f1f5f9] mb-1">3. Evidence-Based Verdict</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                GO / CONDITIONAL / NO-GO — with per-axis scoring, gap analysis, 
                industry benchmarks, and a prioritized remediation roadmap.
              </p>
            </div>
          </div>

          {/* Framework sources */}
          <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <p className="text-xs text-[#4b5563] uppercase tracking-wider mb-4">Synthesized from 12 industry-leading frameworks</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {[
                'Google SRE PRR', 'Amazon ORR', 'DORA Metrics', 'AWS Well-Architected',
                'NASA TRL', 'ISO 25010', 'OWASP AI Top 10', 'Anthropic RSP',
                'MLOps Maturity', 'SPACE Framework', 'ThoughtWorks Fitness', 'Accelerate'
              ].map((fw) => (
                <span key={fw} className="text-[10px] text-[#4b5563] px-2 py-1 rounded border border-[#1e293b] bg-[#111827]/30">
                  {fw}
                </span>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            {[
              'Document-fed assessment',
              'Dynamic framework selection',
              'TRL Level (1-9)',
              'GO / NO-GO verdict',
              'Evidence-cited scoring',
              'Industry benchmarks',
              'Gap analysis',
              'Remediation roadmap',
              'Export JSON / Markdown',
              'Runs locally (zero data sent)',
            ].map((feat) => (
              <span key={feat} className="px-2.5 py-1 text-[10px] rounded-full bg-[#111827] text-[#64748b] border border-[#1e293b]">
                {feat}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
