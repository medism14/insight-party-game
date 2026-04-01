import { useState } from 'react';
import { motion } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { useGame } from '../../hooks/useGame';

export function AnswerInput() {
  const {
    state,
    setPhase,
    submitAnswer,
    nextRespondent,
    getModeConfig,
    getCurrentRespondent,
    getRespondents,
  } = useGame();

  const [answer, setAnswer] = useState('');
  const modeConfig = getModeConfig();
  const respondent = getCurrentRespondent();
  const respondents = getRespondents();

  const handleSubmit = () => {
    if (!answer.trim() || !respondent) return;

    submitAnswer({
      playerId: respondent.id,
      answer: answer.trim(),
    });

    setAnswer('');

    const nextIndex = state.currentRespondentIndex + 1;
    let adjustedNextIndex = nextIndex;

    if (modeConfig?.hasJudge && nextIndex === state.currentJudgeIndex) {
      adjustedNextIndex = nextIndex + 1;
    }

    if (adjustedNextIndex >= state.players.length) {
      if (modeConfig?.hasJudge) {
        setPhase('pass-phone');
      } else if (modeConfig?.hasVoting) {
        setPhase('pass-phone');
      } else {
        setPhase('reveal');
      }
    } else {
      nextRespondent();
      setPhase('pass-phone');
    }
  };

  const handleAnswerKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return;
    if (!e.metaKey && !e.ctrlKey) return;

    e.preventDefault();
    handleSubmit();
  };

  const progress = state.currentAnswers.length;
  const total = respondents.length;

  return (
    <Screen>
      <div className="flex-1 flex flex-col p-6">
        <div className="text-center mb-4">
          <p className="text-white/40 text-sm">
            Reponse {progress + 1} / {total}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="p-4">
            <p className="text-white text-lg text-center">
              {state.currentQuestion?.text}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col"
        >
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={handleAnswerKeyDown}
            placeholder="Ecrivez votre reponse..."
            maxLength={200}
            className="flex-1 p-4 text-lg resize-none min-h-[150px]"
            autoFocus
          />
          <p className="text-white/30 text-sm text-right mt-2">
            {answer.length}/200
          </p>
          <p className="text-white/30 text-sm mt-2">
            Astuce: utilisez Ctrl+Entree ou Cmd+Entree pour valider rapidement.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <Button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            fullWidth
            size="lg"
            color={modeConfig?.color}
          >
            Valider
          </Button>
        </motion.div>
      </div>
    </Screen>
  );
}
