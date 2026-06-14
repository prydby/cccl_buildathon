import React, { useState } from 'react'
import LandingPage from './features/landing/LandingPage.jsx'
import AssessmentForm from './features/assessment/AssessmentForm.jsx'
import useAssessment from './features/assessment/useAssessment.js'
import DimensionRadarChart from './features/results/RadarChart.jsx'
import ScoreCard from './features/results/ScoreCard.jsx'
import NarrativeBlock from './features/results/NarrativeBlock.jsx'
import VerdictBanner from './features/results/VerdictBanner.jsx'
import GapReport from './features/results/GapReport.jsx'
import CompetitorAnalysis from './features/results/CompetitorAnalysis.jsx'
import FrameworkPage from './features/about/FrameworkPage.jsx'
import ArchitecturePage from './features/about/ArchitecturePage.jsx'
import AboutProduct from './features/about/AboutProduct.jsx'
import CabbyPage from './features/demo/CabbyPage.jsx'
import AIAssistant from './features/chat/AIAssistant.jsx'
import Button from './shared/ui/Button.jsx'
import cabbyFixture from './fixtures/cabby.json'

const AXIS_NAMES = [
  'System Architecture', 'Reliability', 'Delivery', 'Observability',
  'Security', 'Scalability', 'Testing', 'Product Signal',
]

function LoadingView() {
  const [progress, setProgress] = useState(0)
  React.useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setProgress(i)
      if (i >= AXIS_NAMES.length) clearInterval(interval)
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
      <div className="relative mb-6">
        <div className="w-16 h-16 border-2 border-[#1e293b] rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-cyan-400">{Math.round((progress / AXIS_NAMES.length) * 100)}%</span>
        </div>
      </div>
      <p className="text-base font-medium text-[#f1f5f9] mb-4">Extracting signals & scoring</p>
      <div className="w-72 space-y-1.5">
        {AXIS_NAMES.map((axis, i) => (
          <div key={axis} className="flex items-center gap-2.5">
            <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all duration-200 ${
              i < progress ? 'border-green-400 bg-green-400/20' : i === progress ? 'border-cyan-400 animate-pulse' : 'border-[#334155]'
            }`}>
              {i < progress && <span className="text-[8px] text-green-400">✓</span>}
            </div>
            <span className={`text-xs ${i < progress ? 'text-[#94a3b8]' : i === progress ? 'text-cyan-400' : 'text-[#334155]'}`}>
              {axis}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FrameworkBadge({ framework }) {
  if (!framework) return null
  return (
    <div className="rounded-xl bg-[#111827] border border-cyan-500/20 p-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-[#4b5563] uppercase tracking-wider">Framework Applied</p>
          <p className="text-sm font-semibold text-cyan-400 mt-0.5">{framework.name}</p>
        </div>
        <span className="text-[10px] text-[#4b5563]">auto-selected by product type</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {framework.sources.map((s) => (
          <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-[#1e293b] text-[#64748b] border border-[#334155]">{s}</span>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [page, setPage] = useState('assess')
  const [view, setView] = useState('input')
  const { assess, isLoading, assessment, reset } = useAssessment()
  const [extras, setExtras] = useState({ competitorAnalysis: null })

  async function handleSubmit(intake) {
    setView('loading')
    setExtras({ competitorAnalysis: null })
    try {
      await assess(intake)
      setView('results')
    } catch {
      setView('input')
    }
  }

  async function handleDemo() {
    setShowLanding(false)
    setPage('assess')
    setView('loading')
    try {
      // Run the REAL engine on Cabby's document; enrich with fixture's market context.
      await assess({
        name: cabbyFixture.intake.name,
        productType: cabbyFixture.intake.productType,
        state: cabbyFixture.intake.state,
        scaleTarget: cabbyFixture.intake.scaleTarget,
        document: cabbyFixture.intake.description,
      })
      setExtras({ competitorAnalysis: cabbyFixture.competitorAnalysis })
      setView('results')
    } catch {
      setView('input')
    }
  }

  function handleReset() {
    reset()
    setExtras({ competitorAnalysis: null })
    setView('input')
  }

  if (showLanding) {
    return (
      <>
        <LandingPage onGetStarted={() => setShowLanding(false)} onDemo={handleDemo} />
        <AIAssistant />
      </>
    )
  }

  const scorecard = assessment?.scorecard
  const trl = assessment?.trl
  const gaps = assessment?.gaps

  return (
    <div className="flex h-screen w-screen bg-[#0a0e17]">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-[#070b12] border-r border-[#1e293b] flex flex-col">
        <div className="px-4 py-4 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
            </div>
            <span className="text-base font-bold text-[#f1f5f9]">Pilot<span className="text-cyan-400">IQ</span></span>
          </div>
          <p className="text-[10px] text-[#4b5563] mt-1">Pilot → Production Readiness</p>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          <p className="text-[10px] text-[#4b5563] uppercase tracking-wider px-3 py-2 font-semibold">Assess</p>
          <NavButton active={page === 'assess'} onClick={() => setPage('assess')} icon="🔬">Readiness Check</NavButton>

          <p className="text-[10px] text-[#4b5563] uppercase tracking-wider px-3 py-2 font-semibold mt-3">Learn</p>
          <NavButton active={page === 'guide'} onClick={() => setPage('guide')} icon="📘">About &amp; Guide</NavButton>
          <NavButton active={page === 'about'} onClick={() => setPage('about')} icon="📖">Framework</NavButton>
          <NavButton active={page === 'arch'} onClick={() => setPage('arch')} icon="⚙️">Architecture</NavButton>
        </nav>

        <div className="p-3 border-t border-[#1e293b] space-y-2">
          <Button variant="primary" size="sm" className="w-full text-xs" onClick={handleDemo} disabled={isLoading}>
            ▶ Demo: Cabby
          </Button>
          <button onClick={() => setShowLanding(true)} className="w-full text-[10px] text-[#4b5563] hover:text-[#94a3b8] py-1">
            ← Home
          </button>
        </div>

        <div className="px-3 pb-3">
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-green-500/5 border border-green-500/10">
            <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <span className="text-[9px] text-green-400/70">Local only • No data sent</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-dot-grid">
        <div className="max-w-4xl mx-auto p-6">
          {page === 'about' && <FrameworkPage />}
          {page === 'arch' && <ArchitecturePage />}
          {page === 'guide' && <AboutProduct onTryDemo={handleDemo} onStart={() => { setPage('assess'); setView('input') }} />}
          {page === 'cabby' && <CabbyPage onAssess={handleDemo} />}

          {page === 'assess' && (
            <>
              <header className="mb-6 sticky top-0 z-20 -mx-6 px-6 py-3 bg-[#0a0e17]/85 backdrop-blur-md border-b border-[#1e293b] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-lg font-semibold text-[#f1f5f9]">
                      {view === 'input' && 'Production Readiness Assessment'}
                      {view === 'loading' && 'Assessing...'}
                      {view === 'results' && `Assessment — ${assessment?.intake?.name || ''}`}
                    </h1>
                    <p className="text-xs text-[#4b5563] mt-0.5">
                      {view === 'input' && 'Feed your product document. Get an evidence-based readiness verdict.'}
                      {view === 'loading' && 'Extracting signals across readiness axes'}
                      {view === 'results' && 'Evidence-based verdict, gap analysis, and remediation roadmap'}
                    </p>
                  </div>
                  {/* Sticky verdict chip — stays visible on long scroll */}
                  {view === 'results' && trl && (
                    <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      trl.verdict === 'GO' ? 'bg-green-500/10 text-green-400 border-green-500/30'
                      : trl.verdict === 'CONDITIONAL' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}>
                      {trl.verdict === 'GO' ? '✓' : trl.verdict === 'CONDITIONAL' ? '!' : '✗'} {trl.verdict.replace('_', '-')} · {scorecard.overall}/10 · TRL {trl.level}
                    </span>
                  )}
                </div>
                {view === 'results' && (
                  <Button variant="ghost" size="sm" onClick={handleReset}>+ New Assessment</Button>
                )}
              </header>

              {view === 'input' && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-3">
                    {/* Differentiation trust strip */}
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      {['Deterministic', 'Evidence-cited', 'Not a ChatGPT wrapper', 'Runs locally'].map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] bg-[#111827] text-[#94a3b8] border border-[#1e293b]">
                          <span className="text-cyan-400">◆</span> {t}
                        </span>
                      ))}
                    </div>
                    <AssessmentForm onSubmit={handleSubmit} isLoading={isLoading} onReset={handleReset} />
                  </div>
                  <div className="lg:col-span-2 hidden lg:flex flex-col justify-center">
                    <div className="px-4">
                      <p className="text-xs text-cyan-400 uppercase tracking-wider mb-2">Pilot → Production</p>
                      <h2 className="text-xl font-bold text-[#f1f5f9] leading-tight">Evidence-based.<br />Not guesswork.</h2>
                      <p className="mt-3 text-xs text-[#64748b] leading-relaxed">
                        PilotIQ reads your document, detects what's present and what's missing,
                        and scores against the framework that fits your product type.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {view === 'loading' && <LoadingView />}

              {view === 'results' && scorecard && (
                <div className="space-y-6">
                  <FrameworkBadge framework={assessment.framework} />
                  <VerdictBanner trlResult={trl} />
                  <DimensionRadarChart data={scorecard.dimensions} animated />
                  <ScoreCard scorecard={scorecard} />
                  <GapReport scorecard={scorecard} trlResult={trl} gaps={gaps} />
                  {extras.competitorAnalysis && <CompetitorAnalysis analysis={extras.competitorAnalysis} />}
                  {assessment.narrative && <NarrativeBlock narrative={assessment.narrative} />}

                  <div className="flex items-center gap-3 pt-4 border-t border-[#1e293b]">
                    <Button variant="secondary" size="sm" onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(assessment, null, 2))
                    }}>📋 Copy JSON</Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      const md = `# PilotIQ Assessment: ${assessment.intake.name}\n\n**Framework:** ${assessment.framework.name}\n**Verdict:** ${trl.verdict}\n**TRL:** ${trl.level}/9\n**Overall:** ${scorecard.overall}/10\n\n## Scores\n${scorecard.dimensions.map(d => `- ${d.name}: ${d.score}/10`).join('\n')}\n\n## Gaps\n${trl.blockingGaps.map(g => `- 🔴 ${g}`).join('\n') || '- None'}\n${trl.warnings.map(w => `- 🟡 ${w}`).join('\n')}`
                      navigator.clipboard.writeText(md)
                    }}>📝 Copy Markdown</Button>
                    <span className="text-[10px] text-[#4b5563] ml-auto">Interoperable export</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <AIAssistant />
    </div>
  )
}

function NavButton({ active, onClick, icon, children }) {
  return (
    <button onClick={onClick} className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-150 flex items-center gap-2 ${
      active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#111827]'
    }`}>
      <span>{icon}</span><span>{children}</span>
    </button>
  )
}
