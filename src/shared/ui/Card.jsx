import React from 'react'

export default function Card({ title, children, glowing = false, className = '', ...props }) {
  return (
    <div
      className={`
        bg-[#1a2332] border border-[#1e293b] rounded-xl p-5
        transition-all duration-250
        ${glowing ? 'border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'hover:border-[#334155]'}
        ${className}
      `}
      {...props}
    >
      {title && (
        <h3 className="text-sm font-medium text-[#94a3b8] uppercase tracking-wider mb-3">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
