import { motion, AnimatePresence } from 'framer-motion';

interface CoinFlipProps {
  isAnimating: boolean;
  result: 'heads' | 'tails' | null;
  choice: 'heads' | 'tails' | null;
}

export function CoinFlip({ isAnimating, result, choice }: CoinFlipProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-40 h-40">
        <motion.div
          className="w-full h-full rounded-full flex items-center justify-center text-6xl shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #ffd700, #b8860b)',
            border: '4px solid #daa520',
          }}
          animate={isAnimating ? {
            rotateY: [0, 1800],
            scale: [1, 1.2, 1],
          } : {
            rotateY: result === 'tails' ? 180 : 0,
          }}
          transition={{
            duration: isAnimating ? 2 : 0.3,
            ease: isAnimating ? [0.17, 0.67, 0.12, 0.99] : 'easeOut',
          }}
        >
          <AnimatePresence mode="wait">
            {isAnimating ? (
              <motion.span
                key="flipping"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-4xl"
              >
                🪙
              </motion.span>
            ) : result ? (
              <motion.span
                key={result}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-5xl"
              >
                {result === 'heads' ? '👤' : '🦅'}
              </motion.span>
            ) : (
              <motion.span
                key="waiting"
                className="text-4xl"
              >
                🪙
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
          }}
          animate={isAnimating ? { opacity: [0.4, 0.8, 0.4] } : {}}
          transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
        />
      </div>

      {result && !isAnimating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-white mb-2">
            {result === 'heads' ? 'PILE' : 'FACE'}
          </p>
          <p className={`text-lg font-medium ${result === choice ? 'text-green-400' : 'text-red-400'}`}>
            {result === choice ? 'Tu as gagne ! 🎉' : 'Perdu ! 😅'}
          </p>
        </motion.div>
      )}
    </div>
  );
}

interface CoinChoiceProps {
  onChoice: (choice: 'heads' | 'tails') => void;
  selected: 'heads' | 'tails' | null;
  disabled?: boolean;
}

export function CoinChoice({ onChoice, selected, disabled }: CoinChoiceProps) {
  return (
    <div className="flex gap-4">
      <motion.button
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={() => !disabled && onChoice('heads')}
        disabled={disabled}
        className={`flex-1 py-6 px-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
          selected === 'heads'
            ? 'bg-yellow-500/30 ring-2 ring-yellow-400'
            : 'bg-surface-light'
        } ${disabled ? 'opacity-50' : ''}`}
      >
        <span className="text-4xl">👤</span>
        <span className="text-white font-bold">PILE</span>
      </motion.button>

      <motion.button
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={() => !disabled && onChoice('tails')}
        disabled={disabled}
        className={`flex-1 py-6 px-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
          selected === 'tails'
            ? 'bg-yellow-500/30 ring-2 ring-yellow-400'
            : 'bg-surface-light'
        } ${disabled ? 'opacity-50' : ''}`}
      >
        <span className="text-4xl">🦅</span>
        <span className="text-white font-bold">FACE</span>
      </motion.button>
    </div>
  );
}
