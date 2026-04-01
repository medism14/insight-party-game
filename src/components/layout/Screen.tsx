import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';
import clsx from 'clsx';

interface ScreenProps {
  children: ReactNode;
  className?: string;
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  color?: string;
}

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export function Screen({
  children,
  className,
  showBack = false,
  onBack,
  title,
  color,
}: ScreenProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={clsx(
        'screen flex flex-col min-h-screen bg-background',
        className
      )}
    >
      {(showBack || title) && (
        <header className="flex items-center justify-between p-4">
          {showBack && onBack ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-surface-light flex items-center justify-center"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>
          ) : (
            <div className="w-10" />
          )}
          {title && (
            <h1
              className="text-lg font-bold"
              style={{ color: color || 'white' }}
            >
              {title}
            </h1>
          )}
          <div className="w-10" />
        </header>
      )}
      <div className="flex-1 flex flex-col">{children}</div>
    </motion.div>
  );
}

export function ScreenTransition({ children, screenKey }: { children: ReactNode; screenKey: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
