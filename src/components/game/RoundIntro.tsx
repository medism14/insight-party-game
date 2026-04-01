import { motion } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { useGame } from '../../hooks/useGame';

export function RoundIntro() {
  const { state, setPhase, startRound, pickRandomPlayer, getModeConfig, resetGame } = useGame();
  const modeConfig = getModeConfig();

  const handleStart = () => {
    startRound();
    pickRandomPlayer();
    setPhase('player-turn');
  };

  return (
    <Screen>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="mb-8"
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4 mx-auto"
            style={{ backgroundColor: `${modeConfig?.color}30` }}
          >
            {modeConfig?.icon}
          </div>
          <h2
            className="text-2xl font-bold"
            style={{ color: modeConfig?.color }}
          >
            {modeConfig?.name}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-white text-xl font-medium mb-4">
            Tour {state.currentRound}
          </p>

          {/* Show all players */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {state.players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <PlayerAvatar
                  name={player.name}
                  color={player.color}
                  size="sm"
                />
              </motion.div>
            ))}
          </div>

          <p className="text-white/60">
            Chaque joueur repond a une question
            <br />
            puis joue a pile ou face !
          </p>

          <div className="flex justify-center gap-4 mt-4 text-white/40 text-sm">
            <span>🎯 Question</span>
            <span>→</span>
            <span>🪙 Pile ou Face</span>
            <span>→</span>
            <span>✨ Points</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-xs"
        >
          <Button
            onClick={handleStart}
            fullWidth
            size="lg"
            color={modeConfig?.color}
          >
            C'est parti !
          </Button>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={resetGame}
        className="absolute top-4 right-4 text-white/40 text-sm"
      >
        Quitter
      </motion.button>
    </Screen>
  );
}
