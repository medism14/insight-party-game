import { motion } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useGame } from '../../hooks/useGame';
import { GAME_MODES } from '../../types/game';
import type { GameMode } from '../../types/game';

export function ModeSelect() {
  const { state, setPhase, selectMode, dismissWarning, cancelModeWarning } = useGame();

  const handleSelectMode = (modeId: GameMode) => {
    const mode = GAME_MODES.find(m => m.id === modeId);
    if (mode && state.players.length >= mode.minPlayers) {
      selectMode(modeId);
    }
  };

  return (
    <Screen
      showBack
      onBack={() => setPhase('party-lobby')}
      title="Mode de jeu"
    >
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {GAME_MODES.map((mode, index) => {
            const isDisabled = state.players.length < mode.minPlayers;

            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  onClick={() => !isDisabled && handleSelectMode(mode.id)}
                  className={`h-full ${isDisabled ? 'opacity-50' : ''}`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                    style={{ backgroundColor: `${mode.color}30` }}
                  >
                    {mode.icon}
                  </div>
                  <h3
                    className="font-bold text-lg mb-1"
                    style={{ color: mode.color }}
                  >
                    {mode.name}
                  </h3>
                  <p className="text-white/60 text-sm">{mode.description}</p>

                  {mode.minPlayers > 2 && (
                    <span
                      className="inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${mode.color}20`,
                        color: mode.color,
                      }}
                    >
                      {mode.minPlayers}+ joueurs
                    </span>
                  )}

                  {mode.hasScoring && (
                    <span className="inline-block mt-2 ml-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                      Points
                    </span>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={state.showWarning}
        onClose={dismissWarning}
        title="Attention !"
        actions={
          <>
            <Button onClick={cancelModeWarning} variant="secondary" fullWidth>
              Annuler
            </Button>
            <Button onClick={dismissWarning} fullWidth color="#DC2626">
              J'ai compris
            </Button>
          </>
        }
      >
        <p className="text-center">
          Ce mode contient des questions intimes et audacieuses. Assurez-vous que tout le monde est a l'aise !
        </p>
      </Modal>
    </Screen>
  );
}
