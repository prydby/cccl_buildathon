import React, { useState, useEffect } from 'react'
import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const data = payload[0].payload
  return (
    <div className="bg-[#1a2332] border border-[#334155] rounded-lg px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-[#f1f5f9]">{data.name}</p>
      <p className="text-lg font-bold text-cyan-400">{data.displayScore}/10</p>
      {data.reasoning && (
        <p className="text-xs text-[#94a3b8] mt-1 max-w-[200px]">{data.reasoning}</p>
      )}
    </div>
  )
}

export default function DimensionRadarChart({ data = [], animated = true }) {
  const [animatedData, setAnimatedData] = useState(
    data.map((d) => ({ ...d, score: 0, displayScore: d.score }))
  )

  useEffect(() => {
    if (!animated || data.length === 0) {
      setAnimatedData(data.map((d) => ({ ...d, displayScore: d.score })))
      return
    }

    // Animate from 0 to actual values
    setAnimatedData(data.map((d) => ({ ...d, score: 0, displayScore: d.score })))

    const duration = 1500
    const startTime = Date.now()

    function animate() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3)

      setAnimatedData(
        data.map((d) => ({
          ...d,
          score: d.score * eased,
          displayScore: d.score,
        }))
      )

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [data, animated])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-[#4b5563]">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" strokeWidth="1" />
            <polygon points="12,6 18,9.5 18,14.5 12,18 6,14.5 6,9.5" strokeWidth="1" />
          </svg>
          <p className="text-sm">Awaiting evaluation data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-draw-in animate-pulse-glow rounded-2xl p-4">
      <ResponsiveContainer width="100%" height={400}>
        <RechartsRadar data={animatedData} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={{ fill: '#4b5563', fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="#06b6d4"
            fillOpacity={0.2}
            dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#22d3ee', stroke: '#06b6d4', strokeWidth: 2 }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  )
}
