import React, { useId } from 'react'

export default function Input({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
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
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2.5 rounded-lg text-sm
          bg-[#0a0e17] border text-[#f1f5f9]
          placeholder:text-[#4b5563]
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-500
          ${error ? 'border-red-500 focus:ring-red-400/30 focus:border-red-500' : 'border-[#1e293b] hover:border-[#334155]'}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}
