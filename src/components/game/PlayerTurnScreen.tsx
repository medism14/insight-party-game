import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { CoinFlip, CoinChoice } from './CoinFlip';
import { useGame } from '../../hooks/useGame';
import { getQuestionsForMode } from '../../data';
import { pickRandomExcluding } from '../../utils/shuffle';

type TurnPhase = 'intro' | 'question' | 'coin-choice' | 'coin-flip' | 'result';

export function PlayerTurnScreen() {
  const {
    state,
    setPhase,
    setQuestion,
    setCoinFlipChoice,
    setCoinFlipResult,
    completePlayerTurn,
    nextPlayerTurn,
    getModeConfig,
    getCurrentPlayer,
    getPlayersRemaining,
  } = useGame();

  const [turnPhase, setTurnPhase] = useState<TurnPhase>('intro');
  const [isAnimating, setIsAnimating] = useState(false);
  const [localResult, setLocalResult] = useState<'heads' | 'tails' | null>(null);

  const modeConfig = getModeConfig();
  const currentPlayer = getCurrentPlayer();
  const playersRemaining = getPlayersRemaining();

  // Set question when entering question phase
  useEffect(() => {
    if (turnPhase === 'question' && !state.currentQuestion && state.mode) {
      const questions = getQuestionsForMode(state.mode);
      const question = pickRandomExcluding(
        questions,
        state.usedQuestionIds,
        q => q.id
      );

      if (question) {
        let text = question.text;
        if (currentPlayer && text.includes('{player}')) {
          text = text.replace(/{player}/g, currentPlayer.name);
        }
        if (text.includes('{player1}') || text.includes('{player2}')) {
          const otherPlayers = state.players.filter(p => p.id !== currentPlayer?.id);
          const shuffled = [...otherPlayers].sort(() => Math.random() - 0.5);
          text = text.replace(/{player1}/g, shuffled[0]?.name || '');
          text = text.replace(/{player2}/g, shuffled[1]?.name || '');
        }
        setQuestion({ ...question, text });
      }
    }
  }, [turnPhase, state.currentQuestion, state.mode, currentPlayer, state.players, state.usedQuestionIds, setQuestion]);

  const handleStartTurn = () => {
    setTurnPhase('question');
  };

  const handleQuestionDone = () => {
    setTurnPhase('coin-choice');
  };

  const handleCoinChoice = (choice: 'heads' | 'tails') => {
    setCoinFlipChoice(choice);
  };

  const handleFlip = useCallback(() => {
    if (!state.coinFlipChoice) return;

    setIsAnimating(true);
    setTurnPhase('coin-flip');

    // Generate result and wait for animation
    const result: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';

    setTimeout(() => {
      setLocalResult(result);
      setIsAnimating(false);
      setCoinFlipResult(result);
      setTurnPhase('result');
    }, 2000);
  }, [state.coinFlipChoice, setCoinFlipResult]);

  const handleContinue = () => {
    completePlayerTurn();

    if (playersRemaining > 1) {
      nextPlayerTurn();
    } else {
      setPhase('round-complete');
    }
  };

  if (!currentPlayer) {
    return null;
  }

  return (
    <Screen>
      <div className="flex-1 flex flex-col p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-4"
        >
          <p className="text-white/40 text-sm">
            Tour {state.currentRound} - {state.playersPlayedThisRound.length + 1}/{state.players.length} joueurs
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {turnPhase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="mb-6"
              >
                <span className="text-6xl">🎯</span>
              </motion.div>

              <p className="text-white/60 text-lg mb-4">C'est au tour de</p>

              <PlayerAvatar
                name={currentPlayer.name}
                color={currentPlayer.color}
                size="xl"
                showName
                className="mb-8"
              />

              <Button
                onClick={handleStartTurn}
                fullWidth
                size="lg"
                color={modeConfig?.color}
                className="max-w-xs"
              >
                C'est moi !
              </Button>
            </motion.div>
          )}

          {turnPhase === 'question' && (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="mb-8"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${modeConfig?.color}30` }}
                >
                  {modeConfig?.icon}
                </div>
              </motion.div>

              <Card className="p-6 mb-8 w-full max-w-md">
                <p className="text-white text-xl font-medium text-center leading-relaxed">
                  {state.currentQuestion?.text || 'Chargement...'}
                </p>
              </Card>

              <p className="text-white/40 text-sm mb-6 text-center">
                Reponds a cette question a voix haute !
              </p>

              <Button
                onClick={handleQuestionDone}
                fullWidth
                size="lg"
                color={modeConfig?.color}
                className="max-w-xs"
              >
                J'ai repondu !
              </Button>
            </motion.div>
          )}

          {turnPhase === 'coin-choice' && (
            <motion.div
              key="coin-choice"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-8"
              >
                <span className="text-5xl mb-4 block">🪙</span>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Pile ou Face ?
                </h2>
                <p className="text-white/60">
                  Choisis et tente ta chance !
                </p>
              </motion.div>

              <div className="w-full max-w-xs mb-8">
                <CoinChoice
                  onChoice={handleCoinChoice}
                  selected={state.coinFlipChoice}
                />
              </div>

              <Button
                onClick={handleFlip}
                disabled={!state.coinFlipChoice}
                fullWidth
                size="lg"
                className="max-w-xs"
                color="#F59E0B"
              >
                Lancer la piece !
              </Button>
            </motion.div>
          )}

          {turnPhase === 'coin-flip' && (
            <motion.div
              key="coin-flip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <CoinFlip
                isAnimating={isAnimating}
                result={localResult}
                choice={state.coinFlipChoice}
              />
            </motion.div>
          )}

          {turnPhase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mb-6"
              >
                <span className="text-7xl">
                  {state.lastTurnWon ? '🎉' : '😅'}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <h2 className={`text-3xl font-bold mb-2 ${
                  state.lastTurnWon ? 'text-green-400' : 'text-red-400'
                }`}>
                  {state.lastTurnWon ? 'Gagne !' : 'Perdu !'}
                </h2>
                <p className="text-white/60">
                  Tu as choisi {state.coinFlipChoice === 'heads' ? 'PILE' : 'FACE'},
                  c'etait {state.coinFlipResult === 'heads' ? 'PILE' : 'FACE'}
                </p>
                {state.lastTurnWon && (
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-yellow-400 font-bold text-lg mt-2"
                  >
                    +1 point !
                  </motion.p>
                )}
              </motion.div>

              <PlayerAvatar
                name={currentPlayer.name}
                color={currentPlayer.color}
                size="lg"
                showName
                className="mb-8"
              />

              <Button
                onClick={handleContinue}
                fullWidth
                size="lg"
                color={modeConfig?.color}
                className="max-w-xs"
              >
                {playersRemaining > 1 ? 'Joueur suivant' : 'Voir les resultats'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  );
}
