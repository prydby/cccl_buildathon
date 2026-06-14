import React from 'react'
import Card from './ui/Card.jsx'

function SkeletonLines() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-full animate-shimmer rounded" />
      <div className="h-4 w-[90%] animate-shimmer rounded" />
      <div className="h-4 w-[95%] animate-shimmer rounded" />
      <div className="h-4 w-[75%] animate-shimmer rounded" />
    </div>
  )
}

export default function NarrativeBlock({ narrative, loading = false }) {
  if (loading) {
    return (
      <Card className="border-l-2 border-l-cyan-500">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h3 className="text-sm font-medium text-[#94a3b8] uppercase tracking-wider">
            Executive Summary
          </h3>
        </div>
        <SkeletonLines />
      </Card>
    )
  }

  if (!narrative) return null

  const paragraphs = narrative.split('\n\n').filter(Boolean)

  return (
    <Card className="border-l-2 border-l-cyan-500 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <h3 className="text-sm font-medium text-[#94a3b8] uppercase tracking-wider">
          Executive Summary
        </h3>
      </div>
      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-[#cbd5e1] leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </Card>
  )
}
