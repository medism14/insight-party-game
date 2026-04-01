import { useState } from 'react';
import { motion } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { ConfettiEffect } from '../common/ConfettiEffect';
import { useGame } from '../../hooks/useGame';

export function RoundComplete() {
  const {
    state,
    setPhase,
    nextRound,
    getModeConfig,
    getLeaderboard,
  } = useGame();

  const [showConfetti] = useState(true);
  const modeConfig = getModeConfig();
  const leaderboard = getLeaderboard();
  const isLastRound = state.currentRound >= state.totalRounds;

  const handleNextRound = () => {
    if (isLastRound) {
      setPhase('scoreboard');
    } else {
      nextRound();
      setPhase('round-intro');
    }
  };

  const handleEndGame = () => {
    setPhase('scoreboard');
  };

  return (
    <Screen>
      <ConfettiEffect
        isActive={showConfetti}
        duration={3000}
      />

      <div className="flex-1 flex flex-col p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <motion.span
            className="text-5xl mb-4 block"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            🏁
          </motion.span>
          <h1 className="text-2xl font-bold text-white mb-2">
            Tour {state.currentRound} termine !
          </h1>
          <p className="text-white/60">
            {isLastRound ? 'Dernier tour !' : `${state.totalRounds - state.currentRound} tour${state.totalRounds - state.currentRound > 1 ? 's' : ''} restant${state.totalRounds - state.currentRound > 1 ? 's' : ''}`}
          </p>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 overflow-y-auto"
        >
          <h2 className="text-lg font-semibold text-white/60 mb-3">
            Classement
          </h2>
          <div className="space-y-2">
            {leaderboard.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="card p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      backgroundColor:
                        index === 0
                          ? '#FFD700'
                          : index === 1
                          ? '#C0C0C0'
                          : index === 2
                          ? '#CD7F32'
                          : 'rgba(255,255,255,0.1)',
                      color: index < 3 ? 'black' : 'white',
                    }}
                  >
                    {index + 1}
                  </span>
                  <PlayerAvatar
                    name={player.name}
                    color={player.color}
                    size="sm"
                  />
                  <span className="text-white font-medium">{player.name}</span>
                </div>
                <span className="text-white font-bold">{player.score} pts</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 space-y-3"
        >
          <Button
            onClick={handleNextRound}
            fullWidth
            size="lg"
            color={modeConfig?.color}
          >
            {isLastRound ? 'Voir le classement final' : 'Tour suivant'}
          </Button>

          {!isLastRound && (
            <Button
              onClick={handleEndGame}
              fullWidth
              size="lg"
              variant="secondary"
            >
              Terminer la partie
            </Button>
          )}
        </motion.div>
      </div>
    </Screen>
  );
}
