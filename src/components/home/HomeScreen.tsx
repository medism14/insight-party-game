import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { useGame } from '../../hooks/useGame';

export function HomeScreen() {
  const { setPhase } = useGame();

  return (
    <div className="screen flex flex-col items-center justify-center p-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.h1
          className="text-6xl font-extrabold gradient-text mb-4"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Insight
        </motion.h1>
        <p className="text-white/60 text-lg">Le jeu de soiree entre amis</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <Button
          onClick={() => setPhase('party-select')}
          size="lg"
          fullWidth
          className="glow-purple"
        >
          Jouer
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute bottom-8 flex gap-2"
      >
        {['🎯', '🔥', '🧠', '⚔️', '🎭'].map((emoji, i) => (
          <motion.span
            key={i}
            className="text-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
