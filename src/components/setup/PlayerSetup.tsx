import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../common/Button';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { Screen } from '../layout/Screen';
import { useGame } from '../../hooks/useGame';

export function PlayerSetup() {
  const { state, addPlayer, removePlayer, setPhase } = useGame();
  const [inputValue, setInputValue] = useState('');

  const handleAddPlayer = () => {
    const name = inputValue.trim();
    if (name && state.players.length < 12) {
      addPlayer(name);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  const canContinue = state.players.length >= 2;

  return (
    <Screen
      showBack
      onBack={() => setPhase('home')}
      title="Joueurs"
    >
      <div className="flex-1 flex flex-col p-4">
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Entrez un prenom..."
              maxLength={20}
              className="flex-1 px-4 py-3 text-lg"
            />
            <Button
              onClick={handleAddPlayer}
              disabled={!inputValue.trim() || state.players.length >= 12}
              className="px-6"
            >
              +
            </Button>
          </div>
          <p className="text-white/40 text-sm mt-2">
            {state.players.length}/12 joueurs (min. 2)
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {state.players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="card flex items-center justify-between p-3 mb-2"
              >
                <div className="flex items-center gap-3">
                  <PlayerAvatar
                    name={player.name}
                    color={player.color}
                    size="md"
                  />
                  <span className="text-white font-medium text-lg">
                    {player.name}
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removePlayer(player.id)}
                  className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          {state.players.length === 0 && (
            <div className="text-center text-white/40 py-12">
              <p className="text-4xl mb-4">👥</p>
              <p>Ajoutez des joueurs pour commencer</p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button
            onClick={() => setPhase('mode-select')}
            disabled={!canContinue}
            fullWidth
            size="lg"
          >
            Choisir un mode ({state.players.length} joueurs)
          </Button>
        </div>
      </div>
    </Screen>
  );
}
