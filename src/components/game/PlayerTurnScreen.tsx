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

type TurnPhase = 'select-player' | 'question' | 'coin-choice' | 'coin-flip' | 'result' | 'round-complete';

export function PlayerTurnScreen() {
  const {
    state,
    setQuestion,
    setCoinFlipChoice,
    setCoinFlipResult,
    getModeConfig,
    resetGame,
  } = useGame();

  const [turnPhase, setTurnPhase] = useState<TurnPhase>('select-player');
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [playedPlayerIds, setPlayedPlayerIds] = useState<Set<string>>(new Set());
  const [roundNumber, setRoundNumber] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [localResult, setLocalResult] = useState<'heads' | 'tails' | null>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(new Set());

  const modeConfig = getModeConfig();
  const selectedPlayer = selectedPlayerIndex !== null ? state.players[selectedPlayerIndex] : null;

  // Players who haven't played this round
  const availablePlayers = state.players.filter(p => !playedPlayerIds.has(p.id));

  // Player wins = question stays secret
  // Player loses = must reveal question
  const playerWon = state.coinFlipChoice === state.coinFlipResult;

  const prepareQuestion = useCallback(() => {
    if (!state.mode) return;

    const questions = getQuestionsForMode(state.mode);
    const question = pickRandomExcluding(questions, usedQuestionIds, q => q.id);

    if (question) {
      let text = question.text;
      if (selectedPlayer && text.includes('{player}')) {
        text = text.replace(/{player}/g, selectedPlayer.name);
      }
      if (text.includes('{player1}') || text.includes('{player2}')) {
        const otherPlayers = state.players.filter((_, i) => i !== selectedPlayerIndex);
        const shuffled = [...otherPlayers].sort(() => Math.random() - 0.5);
        text = text.replace(/{player1}/g, shuffled[0]?.name || '');
        text = text.replace(/{player2}/g, shuffled[1]?.name || '');
      }
      setQuestion({ ...question, text });
      setUsedQuestionIds(prev => new Set([...prev, question.id]));
    }
  }, [state.mode, state.players, selectedPlayer, selectedPlayerIndex, usedQuestionIds, setQuestion]);

  const handleSelectPlayer = (index: number) => {
    const player = state.players[index];
    if (playedPlayerIds.has(player.id)) return; // Already played

    setSelectedPlayerIndex(index);
    setTurnPhase('question');
  };

  useEffect(() => {
    if (turnPhase === 'question' && selectedPlayer && !state.currentQuestion) {
      prepareQuestion();
    }
  }, [turnPhase, selectedPlayer, state.currentQuestion, prepareQuestion]);

  const handleQuestionAsked = () => {
    setTurnPhase('coin-choice');
  };

  const handleCoinChoice = (choice: 'heads' | 'tails') => {
    setCoinFlipChoice(choice);
    setTimeout(() => handleFlip(choice), 150);
  };

  const handleFlip = useCallback((_choice: 'heads' | 'tails') => {
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
    // Mark current player as played
    if (selectedPlayer) {
      setPlayedPlayerIds(prev => new Set([...prev, selectedPlayer.id]));
    }

    // Reset turn state
    setSelectedPlayerIndex(null);
    setLocalResult(null);
    setQuestion(null as any);
    setCoinFlipChoice(null as any);
    setCoinFlipResult(null as any);

    // Check if all players have played
    const newPlayedIds = new Set([...playedPlayerIds, selectedPlayer?.id || '']);
    if (newPlayedIds.size >= state.players.length) {
      setTurnPhase('round-complete');
    } else {
      setTurnPhase('select-player');
    }
  };

  const handleNewRound = () => {
    setPlayedPlayerIds(new Set());
    setRoundNumber(prev => prev + 1);
    setTurnPhase('select-player');
  };

  const handleQuit = () => {
    resetGame();
  };

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
          {/* Phase 1: Select Player */}
          {turnPhase === 'select-player' && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-white mb-1">
                  A qui la question ?
                </h2>
                <p className="text-white/50 text-sm">
                  {availablePlayers.length} joueur{availablePlayers.length > 1 ? 's' : ''} restant{availablePlayers.length > 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-3 max-w-sm">
                  {state.players.map((player, index) => {
                    const hasPlayed = playedPlayerIds.has(player.id);
                    return (
                      <motion.button
                        key={player.id}
                        whileTap={{ scale: hasPlayed ? 1 : 0.95 }}
                        onClick={() => handleSelectPlayer(index)}
                        disabled={hasPlayed}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-opacity ${
                          hasPlayed
                            ? 'opacity-30 cursor-not-allowed'
                            : 'bg-surface-light active:bg-surface'
                        }`}
                      >
                        <PlayerAvatar
                          name={player.name}
                          color={player.color}
                          size="lg"
                        />
                        <span className="text-white text-sm font-medium truncate max-w-[80px]">
                          {player.name}
                        </span>
                        {hasPlayed && (
                          <span className="text-green-400 text-xs">Joue</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 2: Show Question */}
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
                  Reponds a voix haute
                </p>
                <p className="text-white text-xl font-medium text-center leading-relaxed">
                  {state.currentQuestion?.text}
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
                J'ai repondu !
              </Button>
            </motion.div>
          )}

          {/* Phase 3: Coin Choice */}
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
                />
              </div>
            </motion.div>
          )}

          {/* Phase 4: Coin Flip Animation */}
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

          {/* Phase 5: Result */}
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

              {!playerWon && state.currentQuestion && (
                <Card className="w-full max-w-md p-4 mb-6 border-2 border-orange-500/30">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg">👀</span>
                    <p className="text-orange-400 text-sm font-medium">
                      Tout le monde decouvre la question !
                    </p>
                  </div>
                  <p className="text-white text-lg font-medium text-center">
                    {state.currentQuestion.text}
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

          {/* Phase 6: Round Complete */}
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
