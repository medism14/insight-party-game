import { motion } from 'framer-motion';
import clsx from 'clsx';

interface PlayerAvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PlayerAvatar({
  name,
  color,
  size = 'md',
  showName = false,
  selected = false,
  onClick,
  className,
}: PlayerAvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const Component = onClick ? motion.button : motion.div;

  return (
    <div className={clsx('flex flex-col items-center gap-1', className)}>
      <Component
        whileTap={onClick ? { scale: 0.9 } : undefined}
        onClick={onClick}
        className={clsx(
          'rounded-full flex items-center justify-center font-bold text-white',
          sizeStyles[size],
          selected && 'ring-4 ring-white ring-offset-2 ring-offset-background',
          onClick && 'cursor-pointer'
        )}
        style={{ backgroundColor: color }}
      >
        {initials}
      </Component>
      {showName && (
        <span className={clsx(
          'text-white font-medium truncate max-w-[80px]',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base',
          size === 'xl' && 'text-lg'
        )}>
          {name}
        </span>
      )}
    </div>
  );
}
