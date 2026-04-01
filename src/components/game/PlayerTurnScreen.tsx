import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { CoinFlip, CoinChoice } from './CoinFlip';
import { useGame } from '../../hooks/useGame';
import { getQuestionsForMode } from '../../data';
import { pickRandom, pickRandomExcluding } from '../../utils/shuffle';
import { GameStateFallback } from './GameStateFallback';
import type { Question } from '../../types/game';

type TurnPhase = 'loading' | 'question' | 'coin-choice' | 'coin-flip' | 'result' | 'round-complete';

function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

export function PlayerTurnScreen() {
  const {
    state,
    setQuestion,
    setCoinFlipChoice,
    setCoinFlipResult,
    getModeConfig,
    resetGame,
  } = useGame();

  const [playedPlayerIds, setPlayedPlayerIds] = useState<Set<string>>(new Set());
  const [roundNumber, setRoundNumber] = useState(1);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(new Set());
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('loading');
  const [isAnimating, setIsAnimating] = useState(false);
  const [localResult, setLocalResult] = useState<'heads' | 'tails' | null>(null);
  const [displayedQuestion, setDisplayedQuestion] = useState<Question | null>(null);

  // Pick initial random player (only on first mount)
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number>(() => {
    if (state.players.length === 0) return -1;
    return getRandomIndex(state.players.length);
  });

  const modeConfig = getModeConfig();
  const selectedPlayer = selectedPlayerIndex >= 0 ? state.players[selectedPlayerIndex] : null;
  const activeQuestion = displayedQuestion ?? state.currentQuestion;

  // Player wins = question stays secret
  // Player loses = must reveal question
  const playerWon = state.coinFlipChoice === state.coinFlipResult;

  const resetTurnState = useCallback(() => {
    setIsAnimating(false);
    setLocalResult(null);
    setDisplayedQuestion(null);
    setQuestion(null);
    setCoinFlipChoice(null);
    setCoinFlipResult(null);
  }, [setQuestion, setCoinFlipChoice, setCoinFlipResult]);

  // Prepare question for current player
  const prepareQuestionForPlayer = useCallback(() => {
    if (!state.mode || !selectedPlayer) return;

    const questions = getQuestionsForMode(state.mode);
    const nextQuestion =
      pickRandomExcluding(questions, usedQuestionIds, q => q.id) ??
      (questions.length > 0 ? pickRandom(questions) : null);

    if (!nextQuestion) {
      resetTurnState();
      setTurnPhase('round-complete');
      return;
    }

    let text = nextQuestion.text;
    if (text.includes('{player}')) {
      text = text.replace(/{player}/g, selectedPlayer.name);
    }
    if (text.includes('{player1}') || text.includes('{player2}')) {
      const otherPlayers = state.players.filter((_, i) => i !== selectedPlayerIndex);
      if (otherPlayers.length > 0) {
        const idx1 = getRandomIndex(otherPlayers.length);
        let idx2 = idx1;
        if (otherPlayers.length > 1) {
          idx2 = (idx1 + 1) % otherPlayers.length;
        }
        text = text.replace(/{player1}/g, otherPlayers[idx1]?.name || '');
        text = text.replace(/{player2}/g, otherPlayers[idx2]?.name || '');
      }
    }

    const newQuestion = { ...nextQuestion, text };
    setDisplayedQuestion(newQuestion);
    setQuestion(newQuestion);
    setUsedQuestionIds(prev => {
      const nextUsedIds = prev.has(nextQuestion.id) ? new Set<number>() : new Set(prev);
      nextUsedIds.add(nextQuestion.id);
      return nextUsedIds;
    });
    setTurnPhase('question');
  }, [state.mode, state.players, selectedPlayer, selectedPlayerIndex, usedQuestionIds, resetTurnState, setQuestion]);

  // Start the game when component loads
  const handleStart = useCallback(() => {
    prepareQuestionForPlayer();
  }, [prepareQuestionForPlayer]);

  const handleQuestionAsked = () => {
    setTurnPhase('coin-choice');
  };

  const handleCoinChoice = (choice: 'heads' | 'tails') => {
    if (state.coinFlipChoice || isAnimating) return;
    setCoinFlipChoice(choice);
    setTimeout(() => handleFlip(), 150);
  };

  const handleFlip = useCallback(() => {
    setIsAnimating(true);
    setTurnPhase('coin-flip');

    const result: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';

    setTimeout(() => {
      setLocalResult(result);
      setIsAnimating(false);
      setCoinFlipResult(result);
      setTimeout(() => setTurnPhase('result'), 150);
    }, 1500);
  }, [setCoinFlipResult]);

  const handleNext = () => {
    if (!selectedPlayer) {
      resetTurnState();
      setTurnPhase('round-complete');
      return;
    }

    // Mark current player as played
    const newPlayedIds = new Set([...playedPlayerIds, selectedPlayer.id]);
    setPlayedPlayerIds(newPlayedIds);

    // Reset turn state
    resetTurnState();

    // Check if all players have played
    if (newPlayedIds.size >= state.players.length) {
      setTurnPhase('round-complete');
    } else {
      // Pick next random player
      const available = state.players.filter(p => !newPlayedIds.has(p.id));
      if (available.length === 0) {
        setTurnPhase('round-complete');
        return;
      }
      const randomPlayer = available[getRandomIndex(available.length)];
      const nextIndex = state.players.findIndex(p => p.id === randomPlayer.id);
      setSelectedPlayerIndex(nextIndex);
      setTurnPhase('loading');
    }
  };

  const handleNewRound = () => {
    setPlayedPlayerIds(new Set<string>());
    setRoundNumber(prev => prev + 1);
    resetTurnState();
    // Pick random player for new round
    const nextIndex = getRandomIndex(state.players.length);
    setSelectedPlayerIndex(nextIndex);
    setTurnPhase('loading');
  };

  const handleQuit = () => {
    resetTurnState();
    resetGame();
  };

  if (!state.mode || !modeConfig) {
    return (
      <GameStateFallback
        title="Mode de jeu introuvable"
        description="Le tour a ete lance sans mode actif. On peut revenir au choix du mode pour repartir proprement."
        primaryLabel="Choisir un mode"
        onPrimary={handleQuit}
      />
    );
  }

  if (state.players.length === 0) {
    return (
      <GameStateFallback
        title="Aucun joueur charge"
        description="La partie a besoin d'au moins un joueur pour continuer. On revient a l'accueil afin de recreer la partie proprement."
        primaryLabel="Retour a l'accueil"
        onPrimary={handleQuit}
        color={modeConfig.color}
      />
    );
  }

  if (!selectedPlayer && turnPhase !== 'round-complete') {
    return (
      <GameStateFallback
        title="Joueur suivant introuvable"
        description="Le joueur actif n'a pas pu etre determine. On peut relancer proprement la partie sans laisser d'ecran vide."
        primaryLabel="Retour a l'accueil"
        onPrimary={handleQuit}
        color={modeConfig.color}
      />
    );
  }

  if (turnPhase === 'question' && !activeQuestion) {
    return (
      <GameStateFallback
        title="Question indisponible"
        description="La question du joueur n'a pas pu etre preparee. On peut revenir au joueur suivant pour reprendre sans erreur."
        primaryLabel="Revenir au tour"
        onPrimary={() => {
          resetTurnState();
          setTurnPhase('loading');
        }}
        secondaryLabel="Retour a l'accueil"
        onSecondary={handleQuit}
        color={modeConfig.color}
      />
    );
  }

  return (
    <Screen>
      <div className="flex-1 flex flex-col p-4 pb-6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: `${modeConfig?.color}20`, color: modeConfig?.color }}
            >
              {modeConfig?.name}
            </div>
            <span className="text-white/30 text-xs">
              Tour {roundNumber}
            </span>
          </div>
          <button
            onClick={handleQuit}
            className="text-white/40 text-sm active:text-white/60"
          >
            Quitter
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Loading: Prepare question */}
          {turnPhase === 'loading' && selectedPlayer && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col items-center justify-center px-2"
            >
              <div className="text-center mb-6">
                <p className="text-white/50 text-sm mb-2">C'est au tour de</p>
                <PlayerAvatar
                  name={selectedPlayer.name}
                  color={selectedPlayer.color}
                  size="xl"
                  showName
                />
              </div>

              <Button
                onClick={handleStart}
                fullWidth
                size="lg"
                color={modeConfig?.color}
                className="max-w-xs"
              >
                Voir ma question
              </Button>
            </motion.div>
          )}

          {/* Phase 1: Show Question */}
          {turnPhase === 'question' && selectedPlayer && (
            <motion.div
              key="question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col items-center justify-center px-2"
            >
              <div className="text-center mb-4">
                <p className="text-white/50 text-sm mb-2">Question pour</p>
                <PlayerAvatar
                  name={selectedPlayer.name}
                  color={selectedPlayer.color}
                  size="lg"
                  showName
                />
              </div>

              <Card className="w-full max-w-md p-5 mb-6">
                <p className="text-white/40 text-xs uppercase tracking-wide mb-3 text-center">
                  Lis et reponds a voix haute
                </p>
                <p className="text-white text-xl font-medium text-center leading-relaxed">
                  {activeQuestion?.text}
                </p>
              </Card>

              <p className="text-white/40 text-sm mb-6 text-center">
                Les autres ne voient pas la question !
              </p>

              <Button
                onClick={handleQuestionAsked}
                fullWidth
                size="lg"
                color={modeConfig?.color}
                className="max-w-xs"
              >
                Pile ou Face
              </Button>
            </motion.div>
          )}

          {/* Phase 2: Coin Choice */}
          {turnPhase === 'coin-choice' && (
            <motion.div
              key="coin-choice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col items-center justify-center px-4"
            >
              <div className="text-center mb-6">
                <span className="text-5xl mb-3 block">🪙</span>
                <h2 className="text-xl font-bold text-white mb-1">
                  Pile ou Face ?
                </h2>
                <p className="text-white/50 text-sm">
                  Gagne pour garder la question secrete
                </p>
              </div>

              <div className="w-full max-w-sm">
                <CoinChoice
                  onChoice={handleCoinChoice}
                  selected={state.coinFlipChoice}
                  disabled={Boolean(state.coinFlipChoice) || isAnimating}
                />
              </div>
            </motion.div>
          )}

          {/* Phase 3: Coin Flip Animation */}
          {turnPhase === 'coin-flip' && (
            <motion.div
              key="coin-flip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <CoinFlip
                isAnimating={isAnimating}
                result={localResult}
                choice={state.coinFlipChoice}
              />
            </motion.div>
          )}

          {/* Phase 4: Result */}
          {turnPhase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col items-center justify-center text-center px-4"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="mb-4"
              >
                <span className="text-6xl">
                  {playerWon ? '🎉' : '😅'}
                </span>
              </motion.div>

              <h2 className={`text-2xl font-bold mb-2 ${
                playerWon ? 'text-green-400' : 'text-orange-400'
              }`}>
                {playerWon ? 'Tu as gagne !' : 'Perdu !'}
              </h2>

              <p className="text-white/50 text-sm mb-6">
                {state.coinFlipChoice === 'heads' ? 'PILE' : 'FACE'} vs {state.coinFlipResult === 'heads' ? 'PILE' : 'FACE'}
              </p>

              {!playerWon && activeQuestion && (
                <Card className="w-full max-w-md p-4 mb-6 border-2 border-orange-500/30">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg">👀</span>
                    <p className="text-orange-400 text-sm font-medium">
                      Tout le monde decouvre la question !
                    </p>
                  </div>
                  <p className="text-white text-lg font-medium text-center">
                    {activeQuestion.text}
                  </p>
                </Card>
              )}

              {playerWon && (
                <Card className="w-full max-w-md p-4 mb-6 border-2 border-green-500/30">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">🤫</span>
                    <p className="text-green-400 text-sm font-medium">
                      Personne ne saura la question !
                    </p>
                  </div>
                </Card>
              )}

              <Button
                onClick={handleNext}
                fullWidth
                size="lg"
                color={modeConfig?.color}
                className="max-w-xs"
              >
                Suivant
              </Button>
            </motion.div>
          )}

          {/* Phase 5: Round Complete */}
          {turnPhase === 'round-complete' && (
            <motion.div
              key="round-complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col items-center justify-center text-center px-4"
            >
              <span className="text-6xl mb-4">🏁</span>

              <h2 className="text-2xl font-bold text-white mb-2">
                Tour {roundNumber} termine !
              </h2>

              <p className="text-white/50 mb-8">
                Tous les joueurs ont pose leur question
              </p>

              <div className="w-full max-w-xs space-y-3">
                <Button
                  onClick={handleNewRound}
                  fullWidth
                  size="lg"
                  color={modeConfig?.color}
                >
                  Nouveau tour
                </Button>

                <Button
                  onClick={handleQuit}
                  fullWidth
                  size="lg"
                  variant="secondary"
                >
                  Terminer la partie
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  );
}
