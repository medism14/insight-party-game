import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { CoinFlip, CoinChoice } from './CoinFlip';
import { useGame } from '../../hooks/useGame';
import { getQuestionsForMode } from '../../data';
import { pickRandomExcluding } from '../../utils/shuffle';

type TurnPhase = 'intro' | 'question' | 'name-input' | 'coin-choice' | 'coin-flip' | 'result';

const slideVariants = {
  enter: { opacity: 0, y: 30 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

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
  const [responderName, setResponderName] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [localResult, setLocalResult] = useState<'heads' | 'tails' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const modeConfig = getModeConfig();
  const currentPlayer = getCurrentPlayer();
  const playersRemaining = getPlayersRemaining();

  const prepareQuestion = useCallback(() => {
    if (!state.mode || state.currentQuestion) return;

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
  }, [state.mode, state.currentQuestion, state.usedQuestionIds, currentPlayer, state.players, setQuestion]);

  // Prepare question when entering intro
  useEffect(() => {
    if (turnPhase === 'intro') {
      prepareQuestion();
    }
  }, [turnPhase, prepareQuestion]);

  // Focus input when entering name-input phase
  useEffect(() => {
    if (turnPhase === 'name-input' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [turnPhase]);

  const handleStartTurn = () => {
    setTurnPhase('question');
  };

  const handleQuestionAsked = () => {
    setTurnPhase('name-input');
  };

  const handleNameSubmit = () => {
    if (!responderName.trim()) return;
    setTurnPhase('coin-choice');
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && responderName.trim()) {
      e.preventDefault();
      handleNameSubmit();
    }
  };

  const handleCoinChoice = (choice: 'heads' | 'tails') => {
    setCoinFlipChoice(choice);
    // Auto-flip after choice for smoother flow
    setTimeout(() => {
      handleFlip(choice);
    }, 200);
  };

  const handleFlip = useCallback((choice?: 'heads' | 'tails') => {
    const selectedChoice = choice || state.coinFlipChoice;
    if (!selectedChoice) return;

    setIsAnimating(true);
    setTurnPhase('coin-flip');

    const result: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';

    setTimeout(() => {
      setLocalResult(result);
      setIsAnimating(false);
      setCoinFlipResult(result);
      setTimeout(() => setTurnPhase('result'), 300);
    }, 1800);
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

  // Player wins = question stays secret
  // System wins (player loses) = must reveal question
  const playerWon = state.lastTurnWon;
  const mustRevealQuestion = !playerWon;

  return (
    <Screen>
      <div className="flex-1 flex flex-col p-4 pb-6 overflow-hidden">
        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-3"
        >
          <p className="text-white/40 text-xs">
            Tour {state.currentRound} - {state.playersPlayedThisRound.length + 1}/{state.players.length}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Phase 1: Intro */}
          {turnPhase === 'intro' && (
            <motion.div
              key="intro"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col items-center justify-center text-center px-4"
            >
              <p className="text-white/60 text-base mb-4">C'est au tour de</p>

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

          {/* Phase 2: Show Question */}
          {turnPhase === 'question' && (
            <motion.div
              key="question"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col items-center justify-center px-2"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-md mb-6"
              >
                <Card className="p-5">
                  <p className="text-white/40 text-xs uppercase tracking-wide mb-3 text-center">
                    Pose cette question a voix haute
                  </p>
                  <p className="text-white text-xl font-medium text-center leading-relaxed">
                    {state.currentQuestion?.text}
                  </p>
                </Card>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/50 text-sm mb-6 text-center"
              >
                Attends qu'un joueur reponde...
              </motion.p>

              <Button
                onClick={handleQuestionAsked}
                fullWidth
                size="lg"
                color={modeConfig?.color}
                className="max-w-xs"
              >
                Quelqu'un a repondu !
              </Button>
            </motion.div>
          )}

          {/* Phase 3: Name Input */}
          {turnPhase === 'name-input' && (
            <motion.div
              key="name-input"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col items-center justify-center px-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="text-center mb-6"
              >
                <span className="text-4xl mb-3 block">👤</span>
                <h2 className="text-xl font-bold text-white mb-1">
                  Qui a repondu ?
                </h2>
                <p className="text-white/50 text-sm">
                  Entre le prenom du joueur
                </p>
              </motion.div>

              <div className="w-full max-w-xs mb-6">
                <input
                  ref={inputRef}
                  type="text"
                  value={responderName}
                  onChange={e => setResponderName(e.target.value)}
                  onKeyDown={handleNameKeyDown}
                  placeholder="Prenom..."
                  maxLength={20}
                  className="w-full px-5 py-4 text-lg text-center rounded-2xl bg-surface-light text-white placeholder-white/30 border-2 border-transparent focus:border-white/20 outline-none transition-colors"
                  autoComplete="off"
                  autoCapitalize="words"
                />
              </div>

              <Button
                onClick={handleNameSubmit}
                disabled={!responderName.trim()}
                fullWidth
                size="lg"
                color={modeConfig?.color}
                className="max-w-xs"
              >
                Continuer
              </Button>
            </motion.div>
          )}

          {/* Phase 4: Coin Choice */}
          {turnPhase === 'coin-choice' && (
            <motion.div
              key="coin-choice"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col items-center justify-center px-4"
            >
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                className="text-center mb-6"
              >
                <motion.span
                  className="text-5xl mb-3 block"
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  🪙
                </motion.span>
                <h2 className="text-xl font-bold text-white mb-1">
                  Pile ou Face ?
                </h2>
                <p className="text-white/50 text-sm">
                  {responderName} va savoir ou non la question
                </p>
              </motion.div>

              <div className="w-full max-w-sm">
                <CoinChoice
                  onChoice={handleCoinChoice}
                  selected={state.coinFlipChoice}
                />
              </div>

              <p className="text-white/30 text-xs mt-4 text-center">
                Choisis pour lancer automatiquement
              </p>
            </motion.div>
          )}

          {/* Phase 5: Coin Flip Animation */}
          {turnPhase === 'coin-flip' && (
            <motion.div
              key="coin-flip"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <CoinFlip
                isAnimating={isAnimating}
                result={localResult}
                choice={state.coinFlipChoice}
              />
            </motion.div>
          )}

          {/* Phase 6: Result */}
          {turnPhase === 'result' && (
            <motion.div
              key="result"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col items-center justify-center text-center px-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mb-4"
              >
                <span className="text-6xl">
                  {playerWon ? '🎉' : '😅'}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-4"
              >
                <h2 className={`text-2xl font-bold mb-1 ${
                  playerWon ? 'text-green-400' : 'text-orange-400'
                }`}>
                  {playerWon ? 'Tu as gagne !' : 'Perdu !'}
                </h2>
                <p className="text-white/50 text-sm">
                  {state.coinFlipChoice === 'heads' ? 'PILE' : 'FACE'} vs {state.coinFlipResult === 'heads' ? 'PILE' : 'FACE'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="w-full max-w-md mb-6"
              >
                {mustRevealQuestion ? (
                  <Card className="p-4 border-2 border-orange-500/30">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-lg">📢</span>
                      <p className="text-orange-400 text-sm font-medium">
                        {responderName} doit connaitre la question !
                      </p>
                    </div>
                    <p className="text-white text-lg font-medium text-center">
                      {state.currentQuestion?.text}
                    </p>
                  </Card>
                ) : (
                  <Card className="p-4 border-2 border-green-500/30">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">🤫</span>
                      <p className="text-green-400 text-sm font-medium">
                        La question reste secrete !
                      </p>
                    </div>
                    <p className="text-white/50 text-sm mt-2 text-center">
                      {responderName} ne saura jamais ce qu'il a repondu
                    </p>
                  </Card>
                )}
              </motion.div>

              {playerWon && (
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.35, type: 'spring' }}
                  className="text-yellow-400 font-bold text-base mb-4"
                >
                  +1 point pour {currentPlayer.name} !
                </motion.p>
              )}

              <Button
                onClick={handleContinue}
                fullWidth
                size="lg"
                color={modeConfig?.color}
                className="max-w-xs"
              >
                {playersRemaining > 1 ? 'Tour suivant' : 'Voir les resultats'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  );
}
