import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { useGame } from '../../hooks/useGame';
import { shuffle } from '../../utils/shuffle';

export function VoteScreen() {
  const {
    state,
    setPhase,
    castVote,
    nextRespondent,
    getModeConfig,
    getCurrentRespondent,
  } = useGame();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const modeConfig = getModeConfig();
  const currentVoter = getCurrentRespondent();

  const shuffledAnswers = useMemo(
    () => shuffle([...state.currentAnswers]),
    [state.currentAnswers]
  );

  const votableAnswers = modeConfig?.hasJudge
    ? shuffledAnswers
    : shuffledAnswers.filter(a => a.playerId !== currentVoter?.id);

  const votablePlayersForSpicy = useMemo(
    () => state.players.filter(p => p.id !== currentVoter?.id),
    [state.players, currentVoter?.id]
  );

  const isSpicyMode = ['spicy', 'hooot', 'trash'].includes(state.mode || '');

  const handleVote = () => {
    if (!selectedId || !currentVoter) return;

    castVote({
      voterId: currentVoter.id,
      votedForId: selectedId,
    });

    setSelectedId(null);

    const nextIndex = state.currentRespondentIndex + 1;
    if (nextIndex >= state.players.length) {
      setPhase('vote-results');
    } else {
      nextRespondent();
      setPhase('pass-phone');
    }
  };

  return (
    <Screen>
      <div className="flex-1 flex flex-col p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p className="text-white/60 mb-2">
            {currentVoter?.name}, vote pour{' '}
            {isSpicyMode ? 'un joueur' : 'ta reponse preferee'}
          </p>
          <Card className="p-3 inline-block">
            <p className="text-white text-sm">{state.currentQuestion?.text}</p>
          </Card>
          <p className="text-white/30 text-xs mt-2">
            Tu ne peux pas voter pour toi-meme
          </p>
        </motion.div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {isSpicyMode ? (
            <div className="grid grid-cols-2 gap-3">
              {votablePlayersForSpicy.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    onClick={() => setSelectedId(player.id)}
                    selected={selectedId === player.id}
                    className="p-4 flex flex-col items-center"
                  >
                    <PlayerAvatar
                      name={player.name}
                      color={player.color}
                      size="lg"
                      showName
                    />
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            votableAnswers.map((answer, index) => (
              <motion.div
                key={answer.playerId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  onClick={() => setSelectedId(answer.playerId)}
                  selected={selectedId === answer.playerId}
                  className="p-4"
                >
                  <p className="text-white text-lg">{answer.answer}</p>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4"
        >
          <Button
            onClick={handleVote}
            disabled={!selectedId}
            fullWidth
            size="lg"
            color={modeConfig?.color}
          >
            Voter
          </Button>
        </motion.div>
      </div>
    </Screen>
  );
}
