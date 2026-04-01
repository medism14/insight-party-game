import { useState, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { ConfettiEffect } from '../common/ConfettiEffect';
import { useGame } from '../../hooks/useGame';

export function RevealScreen() {
  const {
    state,
    setPhase,
    awardPoints,
    nextJudge,
    nextRound,
    getModeConfig,
  } = useGame();

  const modeConfig = getModeConfig();
  const winner = state.players.find(
    p => p.id === state.selectedBestAnswerId
  );
  const winnerAnswer = state.currentAnswers.find(
    a => a.playerId === state.selectedBestAnswerId
  );

  const shouldShowConfetti = Boolean(winner && modeConfig?.hasScoring);
  const [showConfetti, setShowConfetti] = useState(shouldShowConfetti);
  const pointsAwardedRef = useRef(false);

  useLayoutEffect(() => {
    if (!pointsAwardedRef.current && winner && modeConfig?.hasScoring) {
      pointsAwardedRef.current = true;
      awardPoints(winner.id, modeConfig.pointsForBest);
    }
  }, [winner, modeConfig, awardPoints]);

  const handleContinue = () => {
    nextJudge();
    nextRound();
    setPhase('round-intro');
  };

  return (
    <Screen>
      <ConfettiEffect
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.span
            className="text-6xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            🏆
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-xl text-white/60 mb-4">Le gagnant est...</h2>
          {winner && (
            <PlayerAvatar
              name={winner.name}
              color={winner.color}
              size="xl"
              showName
            />
          )}
          {modeConfig?.hasScoring && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4"
            >
              <span
                className="inline-block px-4 py-2 rounded-full text-lg font-bold"
                style={{
                  backgroundColor: `${modeConfig.color}30`,
                  color: modeConfig.color,
                }}
              >
                +{modeConfig.pointsForBest} point{modeConfig.pointsForBest > 1 ? 's' : ''}
              </span>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md mb-8"
        >
          <Card className="p-4">
            <p className="text-white/60 text-sm mb-2">Sa reponse :</p>
            <p className="text-white text-lg font-medium">
              {winnerAnswer?.answer}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-xs"
        >
          <Button
            onClick={handleContinue}
            fullWidth
            size="lg"
            color={modeConfig?.color}
          >
            Continuer
          </Button>
        </motion.div>
      </div>
    </Screen>
  );
}
