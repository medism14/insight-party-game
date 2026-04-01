import { useState } from 'react';
import { motion } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { useGame } from '../../hooks/useGame';
import { shuffle } from '../../utils/shuffle';

export function JudgingScreen() {
  const {
    state,
    setPhase,
    selectBestAnswer,
    selectWorstAnswer,
    getModeConfig,
    getCurrentJudge,
  } = useGame();

  const [shuffledAnswers] = useState(() => shuffle([...state.currentAnswers]));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const modeConfig = getModeConfig();
  const judge = getCurrentJudge();
  const isSelectingWorst = state.phase === 'judging-worst';

  const handleSelect = (playerId: string) => {
    setSelectedId(playerId);
  };

  const handleConfirm = () => {
    if (!selectedId) return;

    if (isSelectingWorst) {
      selectWorstAnswer(selectedId);
      setPhase('wheel');
    } else {
      selectBestAnswer(selectedId);
      if (modeConfig?.hasWheel) {
        setSelectedId(null);
        setPhase('judging-worst');
      } else {
        setPhase('reveal');
      }
    }
  };

  const filteredAnswers = isSelectingWorst
    ? shuffledAnswers.filter(a => a.playerId !== state.selectedBestAnswerId)
    : shuffledAnswers;

  return (
    <Screen>
      <div className="flex-1 flex flex-col p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p className="text-white/60 mb-2">
            {judge?.name}, choisis la{' '}
            <span
              className="font-bold"
              style={{ color: isSelectingWorst ? '#EF4444' : modeConfig?.color }}
            >
              {isSelectingWorst ? 'PIRE' : 'MEILLEURE'}
            </span>{' '}
            reponse
          </p>
          <Card className="p-3 inline-block">
            <p className="text-white text-sm">{state.currentQuestion?.text}</p>
          </Card>
        </motion.div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {filteredAnswers.map((answer, index) => (
            <motion.div
              key={answer.playerId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                onClick={() => handleSelect(answer.playerId)}
                selected={selectedId === answer.playerId}
                className={`p-4 ${
                  selectedId === answer.playerId
                    ? isSelectingWorst
                      ? 'ring-2 ring-red-500'
                      : ''
                    : ''
                }`}
              >
                <p className="text-white text-lg">{answer.answer}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4"
        >
          <Button
            onClick={handleConfirm}
            disabled={!selectedId}
            fullWidth
            size="lg"
            color={isSelectingWorst ? '#EF4444' : modeConfig?.color}
          >
            {isSelectingWorst ? 'C\'est la pire !' : 'C\'est la meilleure !'}
          </Button>
        </motion.div>
      </div>
    </Screen>
  );
}
