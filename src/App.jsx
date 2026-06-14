import React, { useState } from 'react'
import DeltaInput from './components/DeltaInput.jsx'
import ProductEvalForm from './components/ProductEvalForm.jsx'
import DimensionRadarChart from './components/RadarChart.jsx'
import ScoreCard from './components/ScoreCard.jsx'
import NarrativeBlock from './components/NarrativeBlock.jsx'
import Recommendations from './components/Recommendations.jsx'
import AboutPage from './components/AboutPage.jsx'
import AboutMe from './components/AboutMe.jsx'
import AIAssistant from './components/AIAssistant.jsx'
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
          Evaluate any company or product across 7 research-backed dimensions. 
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
  const [page, setPage] = useState('company') // 'company' | 'product' | 'about' | 'aboutme'
  const [view, setView] = useState('input') // 'input' | 'loading' | 'results'
  const { score, isLoading, result, reset } = useScorer()
  const [narrative, setNarrative] = useState(null)
  const [currentIntake, setCurrentIntake] = useState(null)

  async function handleSubmit(intake) {
    setView('loading')
    setCurrentIntake(intake)
    try {
      const scorecard = await score(intake)
      setNarrative(acmeFixture.narrative)
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

  function navigateTo(newPage) {
    setPage(newPage)
    if (newPage === 'company' || newPage === 'product') {
      if (view === 'results' && page !== newPage) {
        handleReset()
      }
    }
  }

  return (
    <div className="flex h-screen w-screen bg-[#0a0e17] bg-dot-grid">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#070b12] border-r border-[#1e293b] flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[#f1f5f9] tracking-tight">
              Pilot<span className="text-cyan-400">IQ</span>
            </span>
          </div>
          <p className="text-xs text-[#4b5563] mt-1.5">Evaluation Intelligence Platform</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          <p className="text-xs text-[#4b5563] uppercase tracking-wider px-3 py-2 font-medium">Evaluate</p>
          <button
            onClick={() => navigateTo('company')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${
              page === 'company' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#111827]'
            }`}
          >
            <span>🏢</span> Company Eval
          </button>
          <button
            onClick={() => navigateTo('product')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${
              page === 'product' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#111827]'
            }`}
          >
            <span>📱</span> Product Eval
          </button>

          <p className="text-xs text-[#4b5563] uppercase tracking-wider px-3 py-2 font-medium mt-4">Info</p>
          <button
            onClick={() => navigateTo('about')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${
              page === 'about' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#111827]'
            }`}
          >
            <span>📖</span> About PilotIQ
          </button>
          <button
            onClick={() => navigateTo('aboutme')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${
              page === 'aboutme' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#111827]'
            }`}
          >
            <span>👤</span> About Me
          </button>
        </nav>

        {/* Demo Button */}
        <div className="p-4 border-t border-[#1e293b] space-y-2">
          <Button variant="primary" size="sm" className="w-full" onClick={handleDemo} disabled={isLoading}>
            ▶ Try Demo
          </Button>
          <p className="text-xs text-[#4b5563] text-center">Acme Corp — instant preview</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">

          {/* About Pages */}
          {page === 'about' && <AboutPage />}
          {page === 'aboutme' && <AboutMe />}

          {/* Evaluation Pages */}
          {(page === 'company' || page === 'product') && (
            <>
              {/* Header */}
              <header className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-[#f1f5f9]">
                    {view === 'input' && (page === 'company' ? 'Company Evaluation' : 'Product Evaluation')}
                    {view === 'loading' && 'Analyzing...'}
                    {view === 'results' && 'Evaluation Results'}
                  </h1>
                  <p className="text-sm text-[#4b5563] mt-1">
                    {view === 'input' && (page === 'company' ? 'Enter company details for a structured 7-dimension assessment' : 'Enter product details for a comprehensive evaluation')}
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

              {/* Input View */}
              {view === 'input' && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-3">
                    {page === 'company' ? (
                      <DeltaInput onSubmit={handleSubmit} isLoading={isLoading} onReset={handleReset} />
                    ) : (
                      <ProductEvalForm onSubmit={handleSubmit} isLoading={isLoading} onReset={handleReset} />
                    )}
                  </div>
                  <div className="lg:col-span-2 hidden lg:block">
                    <WelcomePanel />
                  </div>
                </div>
              )}

              {/* Loading View */}
              {view === 'loading' && <LoadingView />}

              {/* Results View */}
              {view === 'results' && result && (
                <div className="space-y-8">
                  <DimensionRadarChart data={result.dimensions} animated />
                  <ScoreCard scorecard={result} />
                  <NarrativeBlock narrative={narrative} />
                  <Recommendations scorecard={result} intake={currentIntake} />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* AI Assistant (floating) */}
      <AIAssistant />
    </div>
  )
}
