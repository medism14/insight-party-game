import { motion } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { useGame } from '../../hooks/useGame';
import { GameStateFallback } from './GameStateFallback';

export function QuestionDisplay() {
  const { state, setPhase, getModeConfig, resetGame } = useGame();
  const modeConfig = getModeConfig();

  const handleContinue = () => {
    setPhase('answer');
  };

  if (!state.currentQuestion) {
    return (
      <GameStateFallback
        title="Question indisponible"
        description="La question n'est plus disponible pour ce tour. On peut revenir au debut du round ou relancer la partie proprement."
        primaryLabel="Revenir au round"
        onPrimary={() => setPhase('round-intro')}
        secondaryLabel="Retour a l'accueil"
        onSecondary={resetGame}
        color={modeConfig?.color}
      />
    );
  }

  return (
    <Screen>
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div
            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{
              backgroundColor: `${modeConfig?.color}20`,
              color: modeConfig?.color,
            }}
          >
            {state.currentQuestion?.category || modeConfig?.name}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <Card className="p-6">
            <p className="text-white text-xl font-medium text-center leading-relaxed">
              {state.currentQuestion.text}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-xs mt-8"
        >
          <Button
            onClick={handleContinue}
            fullWidth
            size="lg"
            color={modeConfig?.color}
          >
            Repondre
          </Button>
        </motion.div>
      </div>
    </Screen>
  );
}
