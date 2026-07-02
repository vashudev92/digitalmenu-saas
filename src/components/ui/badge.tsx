'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'error';
  showDot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  showDot = false,
  className = '',
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border';
  
  const variantClasses = {
    default: 'bg-white/[0.04] text-gray-300 border-white/[0.06]',
    gold: 'bg-[#D4A853]/10 text-[#D4A853] border-[#D4A853]/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const dotClasses = {
    default: 'bg-gray-400',
    gold: 'bg-[#D4A853]',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-red-400',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClasses[variant]}`} />}
      {children}
    </span>
  );
}
