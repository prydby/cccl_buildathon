import React, { useId } from 'react'

export default function TextArea({
  label,
  value,
  onChange,
  error,
  placeholder,
  maxLength = 500,
  required = false,
  rows = 4,
  className = '',
  ...props
}) {
  const id = useId()
  const charCount = value?.length || 0

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
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-3 py-2.5 rounded-lg text-sm resize-none
          bg-[#0a0e17] border text-[#f1f5f9]
          placeholder:text-[#4b5563]
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-500
          ${error ? 'border-red-500 focus:ring-red-400/30 focus:border-red-500' : 'border-[#1e293b] hover:border-[#334155]'}
        `}
        {...props}
      />
      <div className="flex justify-between mt-1">
        {error && <p className="text-xs text-red-400">{error}</p>}
        <p className={`text-xs ml-auto ${charCount > maxLength * 0.9 ? 'text-amber-400' : 'text-[#4b5563]'}`}>
          {charCount}/{maxLength}
        </p>
      </div>
    </div>
  )
}
