import React, { useId } from 'react'

export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  error,
  required = false,
  className = '',
  ...props
}) {
  const id = useId()

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[#94a3b8] mb-1.5"
        >
          {label}
          {required && <span className="text-cyan-400 ml-1">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`
          w-full px-3 py-2.5 rounded-lg text-sm appearance-none
          bg-[#0a0e17] border text-[#f1f5f9]
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-500
          ${!value ? 'text-[#4b5563]' : ''}
          ${error ? 'border-red-500' : 'border-[#1e293b] hover:border-[#334155]'}
        `}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      {/* Custom dropdown arrow */}
      <div className="absolute right-3 top-[38px] pointer-events-none">
        <svg className="w-4 h-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
