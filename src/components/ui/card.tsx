'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'style'> {
  variant?: 'default' | 'elevated' | 'interactive' | 'glass';
  className?: string;
  animate?: boolean;
}

export function Card({
  children,
  variant = 'default',
  className = '',
  animate = false,
  ...props
}: CardProps) {
  const baseClasses = 'rounded-xl border transition-all duration-200';
  
  const variantClasses = {
    default: 'surface-1 border-white/[0.06] text-white',
    elevated: 'surface-2 border-white/[0.08] text-white shadow-lg shadow-black/30',
    interactive: 'surface-1 border-white/[0.06] text-white hover:border-[#D4A853]/40 hover:shadow-lg hover:shadow-black/20 cursor-pointer',
    glass: 'glass text-white',
  };

  if (animate && variant === 'interactive') {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
