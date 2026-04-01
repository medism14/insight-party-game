import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  color?: string;
  className?: string;
  animate?: boolean;
}

export function Card({
  children,
  onClick,
  selected = false,
  color,
  className,
  animate = true,
}: CardProps) {
  const baseStyles = `
    card p-4
    ${onClick ? 'cursor-pointer card-interactive' : ''}
    ${selected ? 'ring-2 ring-white' : ''}
  `;

  const content = (
    <div
      className={clsx(baseStyles, className)}
      style={color ? { borderColor: color, borderWidth: 2 } : undefined}
    >
      {children}
    </div>
  );

  if (!animate) {
    return onClick ? (
      <div onClick={onClick}>{content}</div>
    ) : (
      content
    );
  }

  return onClick ? (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {content}
    </motion.div>
  ) : (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {content}
    </motion.div>
  );
}
