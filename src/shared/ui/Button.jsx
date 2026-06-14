import React from 'react'

const variants = {
  primary: 'bg-cyan-500 hover:bg-cyan-400 text-[#0a0e17] font-semibold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]',
  secondary: 'bg-[#1e293b] hover:bg-[#334155] text-[#f1f5f9] border border-[#334155]',
  ghost: 'bg-transparent hover:bg-[#1e293b] text-[#cbd5e1]',
  danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        transition-all duration-200 ease-out
        active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
