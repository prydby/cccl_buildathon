import React, { useState } from 'react'
import DeltaInput from './components/DeltaInput.jsx'
import DimensionRadarChart from './components/RadarChart.jsx'
import ScoreCard from './components/ScoreCard.jsx'
import NarrativeBlock from './components/NarrativeBlock.jsx'
import Button from './components/ui/Button.jsx'
import useScorer from './hooks/useScorer.js'
import acmeFixture from './fixtures/acme.json'

function LoadingView() {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in-up">
      <div className="relative">
        <div className="w-24 h-24 border-2 border-[#1e293b] rounded-full" />
        <div className="absolute inset-0 w-24 h-24 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="mt-6 text-lg text-[#cbd5e1]">Analyzing across 7 dimensions...</p>
      <p className="mt-2 text-sm text-[#4b5563]">Evaluating market, product, team, financials, scalability, moat, and risk</p>
    </div>
  )
}

function WelcomePanel() {
  return (
    <div className="flex flex-col justify-center h-full px-8 py-12">
      <div className="max-w-md">
        <h2 className="text-2xl font-bold text-[#f1f5f9] leading-tight">
          Seven dimensions.<br />
          <span className="text-cyan-400">One clear decision.</span>
        </h2>
        <p className="mt-4 text-sm text-[#94a3b8] leading-relaxed">
          Evaluate any company across 7 research-backed dimensions. 
          Used by investors, accelerators, and product teams for faster, 
          more consistent decisions.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {['Market', 'Product', 'Team', 'Finance', 'Scale', 'Moat', 'Risk'].map((dim) => (
            <span key={dim} className="px-2 py-1 text-xs rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {dim}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState('input') // 'input' | 'loading' | 'results'
  const { score, isLoading, result, reset } = useScorer()
  const [narrative, setNarrative] = useState(null)

  async function handleSubmit(intake) {
    setView('loading')
    try {
      const scorecard = await score(intake)
      setNarrative(acmeFixture.narrative) // Use fixture narrative in mock mode
      setView('results')
    } catch (err) {
      setView('input')
    }
  }

  function handleDemo() {
    handleSubmit(acmeFixture.intake)
  }

  function handleReset() {
    reset()
    setNarrative(null)
    setView('input')
  }

  return (
    <div className="flex h-screen w-screen bg-[#0a0e17] bg-dot-grid">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#070b12] border-r border-[#1e293b] flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
              <polygon points="12,6 18,9.5 18,14.5 12,18 6,14.5 6,9.5" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
            <span className="text-lg font-semibold text-[#f1f5f9] tracking-tight">
              Dimension<span className="text-cyan-400">Score</span>
            </span>
          </div>
          <p className="text-xs text-[#4b5563] mt-1">7-Dimension Evaluation Framework</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => view !== 'loading' && setView('input')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              view === 'input' ? 'bg-[#1e293b] text-[#f1f5f9]' : 'text-[#64748b] hover:text-[#94a3b8] hover:bg-[#111827]'
            }`}
          >
            ◆ Evaluate
          </button>
          <button
            onClick={() => result && setView('results')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              view === 'results' ? 'bg-[#1e293b] text-[#f1f5f9]' : 'text-[#64748b] hover:text-[#94a3b8] hover:bg-[#111827]'
            }`}
          >
            ◇ Results
          </button>
        </nav>

        {/* Demo Button */}
        <div className="p-4 border-t border-[#1e293b]">
          <Button variant="secondary" size="sm" className="w-full" onClick={handleDemo} disabled={isLoading}>
            ▶ Try Demo (Acme Corp)
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          {/* Header */}
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#f1f5f9]">
                {view === 'input' && 'New Evaluation'}
                {view === 'loading' && 'Analyzing...'}
                {view === 'results' && 'Evaluation Results'}
              </h1>
              <p className="text-sm text-[#4b5563] mt-1">
                {view === 'input' && 'Enter company details to generate a structured assessment'}
                {view === 'loading' && 'Processing across all dimensions'}
                {view === 'results' && 'Comprehensive seven-dimension analysis'}
              </p>
            </div>
            {view === 'results' && (
              <Button variant="secondary" size="sm" onClick={handleReset}>
                ← New Evaluation
              </Button>
            )}
          </header>

          {/* Views */}
          {view === 'input' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <DeltaInput
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  onReset={handleReset}
                />
              </div>
              <div className="lg:col-span-2 hidden lg:block">
                <WelcomePanel />
              </div>
            </div>
          )}

          {view === 'loading' && <LoadingView />}

          {view === 'results' && result && (
            <div className="space-y-8">
              <DimensionRadarChart data={result.dimensions} animated />
              <ScoreCard scorecard={result} />
              <NarrativeBlock narrative={narrative} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
