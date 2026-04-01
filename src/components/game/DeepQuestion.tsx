import { useState } from 'react';
import { motion } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { Timer } from '../common/Timer';
import { useGame } from '../../hooks/useGame';

export function DeepQuestion() {
  const {
    state,
    setPhase,
    nextJudge,
    nextRound,
    getModeConfig,
    getCurrentJudge,
  } = useGame();

  const [showTimer, setShowTimer] = useState(false);
  const modeConfig = getModeConfig();
  const currentPlayer = getCurrentJudge();

  const handleContinue = () => {
    nextJudge();
    nextRound();
    setPhase('round-intro');
  };

  return (
    <Screen>
      <div className="flex-1 flex flex-col p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p className="text-white/60 mb-4">C'est au tour de</p>
          {currentPlayer && (
            <PlayerAvatar
              name={currentPlayer.name}
              color={currentPlayer.color}
              size="lg"
              showName
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <Card className="p-6 w-full max-w-md">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 mx-auto"
              style={{ backgroundColor: `${modeConfig?.color}30` }}
            >
              🧠
            </div>
            <p className="text-white text-xl font-medium text-center leading-relaxed">
              {state.currentQuestion?.text}
            </p>
          </Card>

          {showTimer ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8"
            >
              <Timer
                duration={60}
                color={modeConfig?.color}
                size="lg"
              />
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setShowTimer(true)}
              className="mt-8 text-white/40 text-sm underline"
            >
              Activer le timer (60s)
            </motion.button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-white/40 text-sm mb-4"
        >
          Reponds a voix haute au groupe
        </motion.div>

        <Button
          onClick={handleContinue}
          fullWidth
          size="lg"
          color={modeConfig?.color}
        >
          Question suivante
        </Button>
      </div>
    </Screen>
  );
}
