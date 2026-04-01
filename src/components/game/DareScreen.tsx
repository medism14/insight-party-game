import { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { useGame } from '../../hooks/useGame';

export function DareScreen() {
  const {
    state,
    setPhase,
    awardPoints,
    nextJudge,
    nextRound,
    getModeConfig,
  } = useGame();

  const pointsAwardedRef = useRef(false);
  const modeConfig = getModeConfig();

  const loser = state.players.find(
    p => p.id === state.selectedWorstAnswerId
  );
  const winner = state.players.find(
    p => p.id === state.selectedBestAnswerId
  );

  useLayoutEffect(() => {
    if (!pointsAwardedRef.current && modeConfig?.hasScoring) {
      pointsAwardedRef.current = true;
      if (winner) {
        awardPoints(winner.id, modeConfig.pointsForBest);
      }
      if (loser) {
        awardPoints(loser.id, modeConfig.pointsForWorst);
      }
    }
  }, [modeConfig, winner, loser, awardPoints]);

  const handleContinue = () => {
    nextJudge();
    nextRound();
    setPhase('round-intro');
  };

  return (
    <Screen>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
          className="mb-6"
        >
          <motion.span
            className="text-6xl"
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            😈
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-white/60 mb-4">Gage pour</p>
          {loser && (
            <PlayerAvatar
              name={loser.name}
              color={loser.color}
              size="xl"
              showName
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md mb-8"
        >
          <Card className="p-6 bg-gradient-to-br from-red-900/50 to-orange-900/50 border-red-500/30">
            <motion.p
              className="text-white text-xl font-bold"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 1, repeat: 3 }}
            >
              {state.wheelResult}
            </motion.p>
          </Card>
        </motion.div>

        {modeConfig?.hasScoring && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 mb-8"
          >
            {winner && (
              <div className="text-center">
                <PlayerAvatar
                  name={winner.name}
                  color={winner.color}
                  size="md"
                />
                <span className="block mt-1 text-green-400 font-bold">
                  +{modeConfig.pointsForBest}
                </span>
              </div>
            )}
            {loser && (
              <div className="text-center">
                <PlayerAvatar
                  name={loser.name}
                  color={loser.color}
                  size="md"
                />
                <span className="block mt-1 text-red-400 font-bold">
                  {modeConfig.pointsForWorst}
                </span>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
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
