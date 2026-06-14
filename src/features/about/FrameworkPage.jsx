import React from 'react'
import Card from '../../shared/ui/Card.jsx'

const FRAMEWORKS = [
  { name: 'Google SRE PRR', org: 'Google', use: 'Operability, incident readiness, SLO discipline' },
  { name: 'Amazon ORR', org: 'Amazon', use: 'Pre-launch operational bar-raising' },
  { name: 'DORA Four Key Metrics', org: 'Google/DORA Research', use: 'Delivery velocity & stability measurement' },
  { name: 'AWS Well-Architected', org: 'AWS', use: '6-pillar cloud architecture assessment' },
  { name: 'NASA TRL (1-9)', org: 'NASA/DoD', use: 'Technology maturity staging, GO/NO-GO gates' },
  { name: 'ISO 25010 (SQuaRE)', org: 'ISO', use: 'Software quality characteristics model' },
  { name: 'OWASP AI Security Top 10', org: 'OWASP', use: 'AI-specific vulnerability assessment' },
  { name: 'Anthropic RSP', org: 'Anthropic', use: 'AI safety, responsible scaling commitments' },
  { name: 'MLOps Maturity Model', org: 'Google Cloud', use: 'ML/AI deployment maturity staging' },
  { name: 'SPACE Framework', org: 'GitHub/Microsoft', use: 'Developer productivity dimensions' },
  { name: 'ThoughtWorks Fitness Functions', org: 'ThoughtWorks', use: 'Architecture evolvability measurement' },
  { name: 'Accelerate', org: 'Forsgren, Humble, Kim', use: 'High-performing org characteristics' },
]

const FRAMEWORK_SELECTION = [
  { type: 'AI Agent / MCP Tool', framework: 'Agent Readiness Model (ARM)', axes: 'Architecture, Reliability, Safety, Evals, Cost, Observability, Testing, Validation' },
  { type: 'SaaS Platform', framework: 'SaaS Production Readiness (SPR)', axes: 'Multi-tenancy, Security, SLOs, Billing, Scale, Delivery, Testing, Monitoring' },
  { type: 'Consumer App / Marketplace', framework: 'Platform Scale Readiness (PSR)', axes: 'Architecture, Reliability, Delivery, Observability, Security, Scale, Testing, PMF Signal' },
  { type: 'API / Service', framework: 'Service Maturity Model (SMM)', axes: 'Contract Testing, SLOs, Latency, Resilience, Versioning, Documentation, Monitoring' },
  { type: 'Data Pipeline / MLOps', framework: 'DataOps + MLOps Maturity', axes: 'Data Quality, Lineage, Freshness, Governance, Scale, Monitoring, Reproducibility' },
  { type: 'Infrastructure Tool', framework: 'Platform Eng. Maturity (PEM)', axes: 'Self-serve, Golden Paths, Standards, Observability, Cost, Documentation' },
]

export default function AboutPage() {
  return (
    <div className="space-y-10 animate-fade-in-up max-w-4xl">
      {/* Hero */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#f1f5f9]">
          The Framework
        </h1>
        <p className="mt-3 text-sm text-[#94a3b8] leading-relaxed max-w-2xl">
          PilotIQ doesn't invent a framework — it synthesizes from the industry's most 
          rigorous production readiness standards, then dynamically applies the right model 
          based on what you're assessing.
        </p>
      </div>

      {/* Why */}
      <Card glowing>
        <h2 className="text-lg font-bold text-[#f1f5f9] mb-3">Why a new assessment tool?</h2>
        <div className="space-y-3 text-sm text-[#cbd5e1] leading-relaxed">
          <p>
            Every engineering org has a graveyard of pilots that never graduated. They worked in demo, 
            passed the POC review, but when it came time to scale — no observability, no runbooks, no 
            load testing. Gaps surfaced in production, under pressure, at 3 AM.
          </p>
          <p>
            Existing readiness reviews are manual, inconsistent, and depend on who's in the room. 
            Different reviewers check different things. There's no standard that spans product types.
          </p>
          <p className="text-cyan-400 font-medium">
            PilotIQ gives you the structured assessment that catches gaps before they become incidents.
          </p>
        </div>
      </Card>

      {/* 12 Frameworks */}
      <div>
        <h2 className="text-lg font-bold text-[#f1f5f9] mb-2">Synthesized from 12 industry frameworks</h2>
        <p className="text-xs text-[#4b5563] mb-4">We evaluated these frameworks and extracted the axes that matter most for production readiness.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {FRAMEWORKS.map((fw) => (
            <div key={fw.name} className="flex items-start gap-3 bg-[#111827] rounded-lg p-3 border border-[#1e293b]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#f1f5f9]">{fw.name}</span>
                  <span className="text-[10px] text-[#4b5563]">— {fw.org}</span>
                </div>
                <p className="text-[10px] text-[#4b5563] mt-0.5">{fw.use}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Selection */}
      <div>
        <h2 className="text-lg font-bold text-[#f1f5f9] mb-2">Framework adapts to your product</h2>
        <p className="text-xs text-[#4b5563] mb-4">
          The assessment model is selected based on product type. A consumer marketplace is assessed 
          differently from an AI agent or a data pipeline.
        </p>
        <div className="space-y-2">
          {FRAMEWORK_SELECTION.map((fs) => (
            <div key={fs.type} className="bg-[#111827] rounded-lg p-3 border border-[#1e293b]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#f1f5f9]">{fs.type}</span>
                <span className="text-xs text-cyan-400 font-medium">{fs.framework}</span>
              </div>
              <p className="text-[10px] text-[#4b5563] mt-1">Axes: {fs.axes}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How scoring works */}
      <Card>
        <h2 className="text-lg font-bold text-[#f1f5f9] mb-3">How scoring works</h2>
        <div className="space-y-2 text-sm text-[#94a3b8]">
          <p>• Each axis is scored 1-10 based on <strong className="text-[#f1f5f9]">evidence in your document</strong>, not self-reported answers</p>
          <p>• Missing information = gap flagged (you can't game it by omitting things)</p>
          <p>• Scores map to <strong className="text-[#f1f5f9]">NASA TRL levels (1-9)</strong> for a universal maturity indicator</p>
          <p>• Verdict: <span className="text-green-400">GO</span> (all axes ≥7) / <span className="text-amber-400">CONDITIONAL</span> (warnings present) / <span className="text-red-400">NO-GO</span> (blocking gaps below 5)</p>
          <p>• Industry benchmarks show what "top quartile" looks like for each axis in June 2026</p>
          <p>• Remediation roadmap prioritized by: <strong className="text-[#f1f5f9]">risk × effort × business impact</strong></p>
        </div>
      </Card>

      {/* Self-assessment */}
      <Card className="!bg-[#0f172a] border-cyan-500/20">
        <h2 className="text-sm font-bold text-cyan-400 mb-2">🐕 Dog-fooding: PilotIQ assessed itself</h2>
        <div className="grid grid-cols-4 gap-4 mt-3">
          <div className="text-center">
            <p className="text-xl font-bold text-[#f1f5f9]">7.2</p>
            <p className="text-[10px] text-[#4b5563]">Overall</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-amber-400">COND.</p>
            <p className="text-[10px] text-[#4b5563]">Verdict</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#f1f5f9]">TRL 6</p>
            <p className="text-[10px] text-[#4b5563]">Maturity</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#f1f5f9]">1</p>
            <p className="text-[10px] text-[#4b5563]">Gaps</p>
          </div>
        </div>
        <p className="text-[10px] text-[#4b5563] mt-3">Gap: No automated eval suite for assessment quality. Tracked for v2.</p>
      </Card>
    </div>
  )
}
