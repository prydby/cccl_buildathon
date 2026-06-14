import React from 'react'
import Card from '../../shared/ui/Card.jsx'
import Button from '../../shared/ui/Button.jsx'

export default function CabbyPage({ onAssess }) {
  return (
    <div className="space-y-8 animate-fade-in-up max-w-4xl">
      {/* Hero */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl">
              🚕
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#f1f5f9]">Cabby</h1>
              <p className="text-xs text-[#64748b]">AI-Native Cab Aggregation Platform</p>
            </div>
          </div>
          <p className="text-sm text-[#94a3b8] leading-relaxed max-w-xl">
            Compare rides across Uber, Ola, Namma Yatri, BluSmart & Rapido in real-time. 
            AI predicts surge, optimizes routes, and books the best option — saving users 22% on average.
          </p>
        </div>
        <Button size="sm" onClick={onAssess}>Assess Readiness →</Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Users', value: '3,200', sub: '3 cities' },
          { label: 'Daily Rides', value: '1,400', sub: '↑ 12% WoW' },
          { label: 'Avg Savings', value: '22%', sub: 'vs single provider' },
          { label: 'D7 Retention', value: '45%', sub: 'NPS: 58' },
        ].map((m) => (
          <Card key={m.label} className="!p-3 text-center">
            <p className="text-xl font-bold text-[#f1f5f9]">{m.value}</p>
            <p className="text-[10px] text-[#64748b] mt-0.5">{m.label}</p>
            <p className="text-[10px] text-cyan-400">{m.sub}</p>
          </Card>
        ))}
      </div>

      {/* AI Agent Architecture */}
      <Card glowing>
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">AI Agent System Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { agent: '🧠 Price Prediction Agent', desc: 'XGBoost + real-time features. Predicts surge 15 min ahead (87% accuracy). Saves users from surge traps.' },
            { agent: '🗺️ Route Optimization Agent', desc: 'Multi-provider route scoring: price × ETA × driver rating × carbon footprint. Picks the objectively best ride.' },
            { agent: '🔌 Provider Orchestration Agent', desc: 'MCP-based tool-use agent. Handles booking across 5 APIs with automatic failover and retry.' },
            { agent: '👤 User Preference Agent', desc: 'Learns patterns: time-of-day habits, price sensitivity, provider preference. Gets smarter with use.' },
          ].map((a) => (
            <div key={a.agent} className="bg-[#0a0e17] rounded-lg p-3 border border-[#1e293b]">
              <p className="text-xs font-medium text-[#f1f5f9] mb-1">{a.agent}</p>
              <p className="text-[10px] text-[#64748b] leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Tech Stack */}
      <div>
        <h2 className="text-sm font-bold text-[#f1f5f9] mb-3">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {['React Native', 'Next.js', 'Node.js', 'Kubernetes (EKS)', 'Redis Streams', 'PostgreSQL', 'ClickHouse', 'TensorFlow Serving', 'ArgoCD', 'GitHub Actions', 'CloudFront', 'MCP'].map((t) => (
            <span key={t} className="px-2 py-1 text-[10px] rounded bg-[#111827] text-[#64748b] border border-[#1e293b]">{t}</span>
          ))}
        </div>
      </div>

      {/* Competitor Comparison */}
      <div>
        <h2 className="text-sm font-bold text-[#f1f5f9] mb-3">Competitive Position</h2>
        <p className="text-xs text-[#4b5563] mb-4">Cabby is the meta-layer — not competing with providers, but making all of them better for users.</p>
        <div className="space-y-2">
          {[
            { name: 'Uber', edge: 'Users see when Uber is overcharging vs alternatives', color: 'text-[#94a3b8]' },
            { name: 'Ola', edge: 'Aggregated — users get Ola when optimal, not by default', color: 'text-[#94a3b8]' },
            { name: 'Namma Yatri', edge: 'Zero-commission option surfaced when available (driver-friendly)', color: 'text-green-400' },
            { name: 'BluSmart', edge: 'Fixed pricing + EV option surfaced for sustainability-conscious users', color: 'text-green-400' },
            { name: 'Rapido', edge: 'Fastest/cheapest for <5km — included for short trips', color: 'text-[#94a3b8]' },
          ].map((c) => (
            <div key={c.name} className="flex items-center gap-3 bg-[#111827] rounded-lg p-2.5 border border-[#1e293b]">
              <span className="text-xs font-medium text-[#f1f5f9] w-24">{c.name}</span>
              <span className={`text-[10px] ${c.color}`}>↳ Cabby advantage: {c.edge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Unique Moat */}
      <Card className="!bg-[#0f172a]">
        <h3 className="text-xs font-bold text-[#f1f5f9] mb-2">Defensible Advantages</h3>
        <ul className="space-y-1.5 text-[10px] text-[#94a3b8]">
          <li>• Multi-provider aggregation — no single provider offers this</li>
          <li>• Surge prediction 15 min ahead (87% accuracy) — unique AI capability</li>
          <li>• User preference learning — gets smarter with every ride</li>
          <li>• Provider-agnostic — survives any provider exiting or being acquired</li>
          <li>• Carbon footprint scoring — ESG-conscious differentiator</li>
        </ul>
      </Card>

      {/* Links */}
      <div className="flex items-center gap-4 pt-4 border-t border-[#1e293b]">
        <a href="https://github.com/prydby/cccl_buildathon" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          GitHub Repo
        </a>
        <span className="text-[10px] text-[#334155]">•</span>
        <span className="text-xs text-[#4b5563]">Status: External Pilot (3 cities)</span>
        <span className="text-[10px] text-[#334155]">•</span>
        <span className="text-xs text-[#4b5563]">Scale target: 50 cities, 100K users</span>
      </div>
    </div>
  )
}
