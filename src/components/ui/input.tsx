'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full text-left">
        {label && (
          <label className="block text-xs font-semibold text-gray-400 tracking-wide uppercase select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-gray-500 pointer-events-none flex items-center justify-center shrink-0">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-[#111113] hover:bg-white/[0.02] border ${
              error ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/[0.06] focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853]'
            } text-white rounded-xl text-sm px-4 py-3 outline-none transition-all ${
              leftIcon ? 'pl-11' : ''
            } ${rightIcon ? 'pr-11' : ''} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-gray-500 pointer-events-none flex items-center justify-center shrink-0">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {!error && helperText && <p className="text-[11px] text-gray-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full text-left">
        {label && (
          <label className="block text-xs font-semibold text-gray-400 tracking-wide uppercase select-none">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full bg-[#111113] hover:bg-white/[0.02] border ${
            error ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/[0.06] focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853]'
          } text-white rounded-xl text-sm px-4 py-3 outline-none transition-all min-h-[100px] resize-y ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {!error && helperText && <p className="text-[11px] text-gray-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full text-left">
        {label && (
          <label className="block text-xs font-semibold text-gray-400 tracking-wide uppercase select-none">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full bg-[#111113] hover:bg-white/[0.02] border ${
            error ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/[0.06] focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853]'
          } text-white rounded-xl text-sm px-4 py-3 outline-none transition-all cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-[#111113] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {!error && helperText && <p className="text-[11px] text-gray-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
