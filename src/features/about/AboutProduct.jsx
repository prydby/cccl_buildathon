import React from 'react'
import Card from '../../shared/ui/Card.jsx'
import Button from '../../shared/ui/Button.jsx'

export default function AboutProduct({ onTryDemo, onStart }) {
  return (
    <div className="space-y-8 animate-fade-in-up max-w-3xl">
      {/* Hero */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#f1f5f9]">
          About Pilot<span className="text-cyan-400">IQ</span>
        </h1>
        <p className="mt-3 text-base text-[#cbd5e1] leading-relaxed">
          PilotIQ answers one hard question: <span className="text-cyan-400 font-medium">"Is my product actually ready for production?"</span>
        </p>
        <p className="mt-3 text-sm text-[#94a3b8] leading-relaxed">
          You paste your product write-up. In about a minute you get a clear GO, CONDITIONAL,
          or NO-GO verdict — with the exact reasons behind it and a plan to fix what's missing.
          No jargon required to read the result.
        </p>
      </div>

      {/* Plain-English value */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="!p-4">
          <div className="text-2xl mb-2">🧭</div>
          <h3 className="text-sm font-semibold text-[#f1f5f9] mb-1">Know where you stand</h3>
          <p className="text-xs text-[#94a3b8] leading-relaxed">A single score and verdict you can take to your team or your boss.</p>
        </Card>
        <Card className="!p-4">
          <div className="text-2xl mb-2">🔍</div>
          <h3 className="text-sm font-semibold text-[#f1f5f9] mb-1">See the proof</h3>
          <p className="text-xs text-[#94a3b8] leading-relaxed">Every score shows what your doc has and what it's missing. No black box.</p>
        </Card>
        <Card className="!p-4">
          <div className="text-2xl mb-2">🛠️</div>
          <h3 className="text-sm font-semibold text-[#f1f5f9] mb-1">Know what to fix</h3>
          <p className="text-xs text-[#94a3b8] leading-relaxed">A prioritized roadmap of the gaps that matter, with a rough timeline.</p>
        </Card>
      </div>

      {/* User Guide */}
      <Card glowing>
        <h2 className="text-lg font-bold text-[#f1f5f9] mb-1">User Guide</h2>
        <p className="text-xs text-[#4b5563] mb-5">Four steps, about two minutes.</p>
        <div className="space-y-5">
          {[
            {
              n: '1',
              t: 'Describe your product',
              d: 'Go to Readiness Check. Give it a name, pick the product type (this chooses the right scoring framework for you), and paste your document — a BRD, PRD, architecture note, or even a detailed paragraph. More detail = sharper result.',
            },
            {
              n: '2',
              t: 'Run the assessment',
              d: 'Click Run Assessment. PilotIQ reads the text, finds evidence of what you have (and what you don\'t), and scores 8 readiness areas. Everything runs in your browser — nothing is uploaded.',
            },
            {
              n: '3',
              t: 'Read your verdict',
              d: 'You get a GO / CONDITIONAL / NO-GO verdict, a maturity level (TRL 1–9), and a radar chart. Click any score to expand it and see the exact evidence — green ✓ for what you have, red ✗ for what\'s missing.',
            },
            {
              n: '4',
              t: 'Fix the gaps & share',
              d: 'The Gap Report ranks what to fix first and gives a week-by-week roadmap. Export to JSON or Markdown to drop into Slack, Notion, or a review doc. Re-run anytime to track progress.',
            },
          ].map((step) => (
            <div key={step.n} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-sm font-bold text-cyan-400">
                {step.n}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#f1f5f9]">{step.t}</h4>
                <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">{step.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6 pt-5 border-t border-[#1e293b]">
          <Button size="sm" onClick={onStart}>Start an assessment</Button>
          <Button variant="secondary" size="sm" onClick={onTryDemo}>▶ Watch the Cabby demo</Button>
        </div>
      </Card>

      {/* Who it's for */}
      <div>
        <h2 className="text-lg font-bold text-[#f1f5f9] mb-3">Who it's for</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ['Founders', 'Sanity-check your product before you tell investors or users it\'s "ready."'],
            ['Eng leaders', 'Make a confident go/no-go call before committing the team to scale.'],
            ['Engineers', 'Run a consistent readiness review in minutes instead of by hand.'],
            ['AI teams', 'Specialized for AI agents & MCP products — and callable by Claude as a tool.'],
          ].map(([who, why]) => (
            <div key={who} className="bg-[#111827] rounded-lg p-3 border border-[#1e293b]">
              <span className="text-sm font-medium text-cyan-400">{who}</span>
              <p className="text-xs text-[#94a3b8] mt-0.5">{why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-bold text-[#f1f5f9] mb-3">Quick answers</h2>
        <div className="space-y-2.5">
          {[
            ['Is my data safe?', 'Yes. Everything runs locally in your browser. Your document is never uploaded to any server.'],
            ['How is this different from asking ChatGPT?', 'PilotIQ is deterministic and evidence-based — same input always gives the same verdict, and it shows its reasoning. It won\'t flatter you; it\'s willing to say NO.'],
            ['Do I need to be technical?', 'No to read the result — the verdict and guidance are plain English. The more technical detail you provide, the sharper the assessment.'],
            ['Can my AI agent use it?', 'Yes. PilotIQ ships as an MCP server, so Claude and other agents can call it as a tool to check readiness automatically.'],
          ].map(([q, a]) => (
            <div key={q} className="bg-[#111827] rounded-lg p-3.5 border border-[#1e293b]">
              <p className="text-sm font-medium text-[#f1f5f9]">{q}</p>
              <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
