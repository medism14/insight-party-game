import { useState } from 'react';
import { motion } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { ConfettiEffect } from '../common/ConfettiEffect';
import { useGame } from '../../hooks/useGame';

export function Scoreboard() {
  const { state, setPhase, resetGame, getLeaderboard, getModeConfig } = useGame();
  const [showConfetti, setShowConfetti] = useState(true);
  const modeConfig = getModeConfig();
  const leaderboard = getLeaderboard();

  const hasScores = leaderboard.some(p => p.score > 0);
  const top3 = leaderboard.slice(0, 3);

  const handlePlayAgain = () => {
    resetGame();
    setPhase('mode-select');
  };

  const handleNewGame = () => {
    resetGame();
    setPhase('party-lobby');
  };

  const podiumOrder = hasScores ? [1, 0, 2] : [];
  const podiumHeights = ['h-24', 'h-32', 'h-16'];
  const podiumColors = ['#C0C0C0', '#FFD700', '#CD7F32'];

  return (
    <Screen>
      <ConfettiEffect
        isActive={showConfetti}
        duration={5000}
        onComplete={() => setShowConfetti(false)}
      />

      <div className="flex-1 flex flex-col p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Fin de la partie !
          </h1>
          <p className="text-white/60">
            {modeConfig?.name} - {state.players.length} joueurs
          </p>
        </motion.div>

        {hasScores && top3.length >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center items-end gap-2 mb-8"
          >
            {podiumOrder.map((playerIndex, podiumPosition) => {
              const player = top3[playerIndex];
              if (!player) return null;

              return (
                <motion.div
                  key={player.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + podiumPosition * 0.2 }}
                  className="flex flex-col items-center"
                >
                  <PlayerAvatar
                    name={player.name}
                    color={player.color}
                    size="lg"
                    showName
                    className="mb-2"
                  />
                  <span className="text-white font-bold mb-2">
                    {player.score} pts
                  </span>
                  <div
                    className={`w-20 ${podiumHeights[podiumPosition]} rounded-t-lg flex items-start justify-center pt-2`}
                    style={{ backgroundColor: podiumColors[podiumPosition] }}
                  >
                    <span className="text-2xl font-bold text-black/70">
                      {playerIndex + 1}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex-1 overflow-y-auto"
        >
          <h2 className="text-lg font-semibold text-white/60 mb-3">
            Classement complet
          </h2>
          <div className="space-y-2">
            {leaderboard.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 space-y-3"
        >
          <Button
            onClick={handlePlayAgain}
            fullWidth
            size="lg"
            color={modeConfig?.color}
          >
            Changer de mode
          </Button>
          <Button
            onClick={handleNewGame}
            fullWidth
            size="lg"
            variant="secondary"
          >
            Nouvelle partie
          </Button>
        </motion.div>
      </div>
    </Screen>
  );
}
