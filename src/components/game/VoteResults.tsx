import { useMemo, useState, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { ConfettiEffect } from '../common/ConfettiEffect';
import { useGame } from '../../hooks/useGame';

export function VoteResults() {
  const {
    state,
    setPhase,
    awardPoints,
    nextJudge,
    nextRound,
    getModeConfig,
  } = useGame();

  const modeConfig = getModeConfig();
  const pointsAwardedRef = useRef(false);

  const isSpicyMode = ['spicy', 'hooot', 'trash'].includes(state.mode || '');

  const results = useMemo(() => {
    const voteCounts: Record<string, number> = {};

    state.currentVotes.forEach(vote => {
      voteCounts[vote.votedForId] = (voteCounts[vote.votedForId] || 0) + 1;
    });

    const sortedResults = Object.entries(voteCounts)
      .map(([playerId, votes]) => {
        const player = state.players.find(p => p.id === playerId);
        const answer = state.currentAnswers.find(a => a.playerId === playerId);
        return {
          playerId,
          player,
          answer: answer?.answer,
          votes,
        };
      })
      .sort((a, b) => b.votes - a.votes);

    return sortedResults;
  }, [state.currentVotes, state.players, state.currentAnswers]);

  const winner = results[0];
  const maxVotes = winner?.votes || 0;
  const winners = results.filter(r => r.votes === maxVotes);

  const shouldShowConfetti = Boolean(modeConfig?.hasScoring && winners.length > 0);
  const [showConfetti, setShowConfetti] = useState(shouldShowConfetti);

  useLayoutEffect(() => {
    if (!pointsAwardedRef.current && modeConfig?.hasScoring && winners.length > 0) {
      pointsAwardedRef.current = true;
      const pointsPerWinner = winners.length > 1 ? 1 : modeConfig.pointsForBest;
      winners.forEach(w => {
        awardPoints(w.playerId, pointsPerWinner);
      });
    }
  }, [modeConfig, winners, awardPoints]);

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

      <div className="flex-1 flex flex-col p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Resultats</h2>
          <Card className="p-3 inline-block">
            <p className="text-white/80 text-sm">{state.currentQuestion?.text}</p>
          </Card>
        </motion.div>

        <div className="flex-1 overflow-y-auto">
          {isSpicyMode ? (
            <div className="space-y-4">
              {results.map((result, index) => (
                <motion.div
                  key={result.playerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`p-4 ${
                      index === 0 ? 'ring-2' : ''
                    }`}
                    color={index === 0 ? modeConfig?.color : undefined}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <PlayerAvatar
                          name={result.player?.name || ''}
                          color={result.player?.color || ''}
                          size="md"
                        />
                        <span className="text-white font-medium">
                          {result.player?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-2xl font-bold"
                          style={{ color: index === 0 ? modeConfig?.color : 'white' }}
                        >
                          {result.votes}
                        </span>
                        <span className="text-white/40">votes</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <motion.div
                  key={result.playerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`p-4 ${index === 0 ? 'ring-2' : ''}`}
                    color={index === 0 ? modeConfig?.color : undefined}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <PlayerAvatar
                          name={result.player?.name || ''}
                          color={result.player?.color || ''}
                          size="sm"
                        />
                        <span className="text-white/60 text-sm">
                          {result.player?.name}
                        </span>
                      </div>
                      <span
                        className="font-bold"
                        style={{ color: index === 0 ? modeConfig?.color : 'white' }}
                      >
                        {result.votes} {result.votes > 1 ? 'votes' : 'vote'}
                      </span>
                    </div>
                    <p className="text-white text-lg">{result.answer}</p>
                    {index === 0 && modeConfig?.hasScoring && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block mt-2 px-2 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: `${modeConfig.color}30`,
                          color: modeConfig.color,
                        }}
                      >
                        +{winners.length > 1 ? 1 : modeConfig.pointsForBest} pts
                      </motion.span>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4"
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
