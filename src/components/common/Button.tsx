import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  color?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className,
  color,
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-2xl transition-transform duration-100 flex items-center justify-center gap-2 will-change-transform';

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]',
  };

  const variantStyles = {
    primary: 'bg-classic text-white shadow-lg shadow-classic/30',
    secondary: 'bg-surface-light text-white border border-white/10',
    danger: 'bg-red-600 text-white shadow-lg shadow-red-600/30',
    ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/5',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={clsx(
        baseStyles,
        sizeStyles[size],
        !color && variantStyles[variant],
        fullWidth && 'w-full',
        disabled && disabledStyles,
        className
      )}
      style={color ? { backgroundColor: color, color: 'white' } : undefined}
    >
      {children}
    </motion.button>
  );
}
