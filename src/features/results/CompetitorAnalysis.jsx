import React from 'react'
import Card from '../../shared/ui/Card.jsx'

export default function CompetitorAnalysis({ analysis }) {
  if (!analysis) return null

  return (
    <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
      <div>
        <h3 className="text-lg font-semibold text-[#f1f5f9]">Competitive Landscape</h3>
        <p className="text-xs text-[#4b5563] mt-0.5">{analysis.cabbyUniquePosition}</p>
      </div>

      {/* Competitor cards */}
      <div className="space-y-2">
        {analysis.competitors.map((comp) => (
          <Card key={comp.name} className="!p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-semibold text-[#f1f5f9]">{comp.name}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Cabby edge
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-[10px] text-green-400 font-medium mb-1">Strengths</p>
                <ul className="space-y-0.5">
                  {comp.strengths.map((s, i) => (
                    <li key={i} className="text-[10px] text-[#64748b]">+ {s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] text-red-400 font-medium mb-1">Weaknesses</p>
                <ul className="space-y-0.5">
                  {comp.weaknesses.map((w, i) => (
                    <li key={i} className="text-[10px] text-[#64748b]">− {w}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="pt-2 border-t border-[#1e293b]">
              <p className="text-[10px] text-cyan-400">
                <span className="text-[#4b5563]">Cabby advantage:</span> {comp.cabbyAdvantage}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Competitive edge summary */}
      <Card className="!bg-[#0f172a] border-cyan-500/20">
        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Defensible Competitive Edge</h4>
        <ul className="space-y-1.5">
          {analysis.competitiveEdge.map((edge, i) => (
            <li key={i} className="text-xs text-[#cbd5e1] flex items-start gap-2">
              <span className="text-cyan-400 flex-shrink-0">◆</span>
              {edge}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
