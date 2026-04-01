import { motion } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { useGame } from '../../hooks/useGame';

export function PassPhone() {
  const {
    state,
    setPhase,
    getModeConfig,
    getCurrentJudge,
    getCurrentRespondent,
    getRespondents,
  } = useGame();

  const modeConfig = getModeConfig();
  const judge = getCurrentJudge();
  const respondent = getCurrentRespondent();
  const respondents = getRespondents();

  const isReturningToJudge =
    modeConfig?.hasJudge &&
    state.currentAnswers.length === respondents.length;

  const targetPlayer = isReturningToJudge ? judge : respondent;

  const getMessage = () => {
    if (isReturningToJudge) {
      return `Rendez le telephone a ${judge?.name}`;
    }
    return `Passez le telephone a ${targetPlayer?.name}`;
  };

  const isSpicyMode = ['spicy', 'hooot', 'trash'].includes(state.mode || '');
  const isBattleVotingPhase = state.mode === 'battle' && state.currentAnswers.length === state.players.length;

  const getSubMessage = () => {
    if (isReturningToJudge) {
      return 'Toutes les reponses ont ete soumises !';
    }
    if (isSpicyMode || isBattleVotingPhase) {
      return 'C\'est ton tour de voter !';
    }
    return 'C\'est ton tour de repondre !';
  };

  const handleConfirm = () => {
    if (isReturningToJudge) {
      setPhase('judging');
    } else if (isSpicyMode) {
      setPhase('vote');
    } else if (isBattleVotingPhase) {
      setPhase('vote');
    } else {
      setPhase('question');
    }
  };

  if (!targetPlayer) return null;

  return (
    <Screen>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            <span className="text-6xl">📱</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-white/60 text-lg mb-4">{getMessage()}</p>
          <PlayerAvatar
            name={targetPlayer.name}
            color={targetPlayer.color}
            size="xl"
            showName
          />
          <p className="text-white/40 text-sm mt-4">{getSubMessage()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-xs"
        >
          <Button
            onClick={handleConfirm}
            fullWidth
            size="lg"
            color={modeConfig?.color}
          >
            C'est moi, {targetPlayer.name} !
          </Button>
        </motion.div>
      </div>
    </Screen>
  );
}
