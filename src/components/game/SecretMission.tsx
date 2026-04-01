import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { useGame } from '../../hooks/useGame';

export function SecretMission() {
  const {
    state,
    setPhase,
    nextJudge,
    nextRound,
    getModeConfig,
    getCurrentJudge,
  } = useGame();

  const [phase, setLocalPhase] = useState<'warning' | 'mission' | 'done'>('warning');
  const modeConfig = getModeConfig();
  const missionPlayer = getCurrentJudge();

  const handleShowMission = () => {
    setLocalPhase('mission');
  };

  const handleConfirmRead = () => {
    setLocalPhase('done');
  };

  const handleContinue = () => {
    nextJudge();
    nextRound();
    setPhase('round-intro');
  };

  return (
    <Screen>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <AnimatePresence mode="wait">
          {phase === 'warning' && (
            <motion.div
              key="warning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <motion.span
                className="text-6xl mb-6 block"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🤫
              </motion.span>

              <h2 className="text-2xl font-bold text-white mb-4">
                Mission Secrete !
              </h2>

              <p className="text-white/60 mb-6">
                Passez le telephone a
              </p>

              {missionPlayer && (
                <PlayerAvatar
                  name={missionPlayer.name}
                  color={missionPlayer.color}
                  size="xl"
                  showName
                  className="mb-6"
                />
              )}

              <Card className="p-4 mb-6 bg-orange-900/30 border-orange-500/30">
                <p className="text-orange-300 font-medium">
                  LES AUTRES, NE REGARDEZ PAS !
                </p>
              </Card>

              <Button
                onClick={handleShowMission}
                fullWidth
                size="lg"
                color={modeConfig?.color}
              >
                C'est moi, {missionPlayer?.name} !
              </Button>
            </motion.div>
          )}

          {phase === 'mission' && (
            <motion.div
              key="mission"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <motion.span
                className="text-6xl mb-6 block"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                🎭
              </motion.span>

              <h2 className="text-xl font-bold text-white mb-2">
                Ta mission secrete :
              </h2>

              <Card className="p-6 mb-6 bg-gradient-to-br from-orange-900/50 to-yellow-900/50 border-orange-500/30">
                <p className="text-white text-xl font-medium leading-relaxed">
                  {state.secretMission}
                </p>
              </Card>

              <p className="text-white/40 text-sm mb-6">
                Ne montre cette mission a personne !
              </p>

              <Button
                onClick={handleConfirmRead}
                fullWidth
                size="lg"
                color={modeConfig?.color}
              >
                J'ai compris ma mission
              </Button>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <motion.span className="text-6xl mb-6 block">
                ✅
              </motion.span>

              <h2 className="text-2xl font-bold text-white mb-4">
                Mission en cours...
              </h2>

              <p className="text-white/60 mb-6">
                {missionPlayer?.name} a une mission secrete a accomplir !
              </p>

              <Card className="p-4 mb-6">
                <p className="text-white/80 text-sm">
                  Observez bien {missionPlayer?.name} et essayez de deviner sa mission.
                  Quand vous pensez l'avoir trouvee, passez a la question suivante.
                </p>
              </Card>

              <Button
                onClick={handleContinue}
                fullWidth
                size="lg"
                color={modeConfig?.color}
              >
                Question suivante
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  );
}
