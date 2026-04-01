import { AnimatePresence } from 'framer-motion';
import { useGame } from '../../hooks/useGame';
import { RoundIntro } from './RoundIntro';
import { PlayerTurnScreen } from './PlayerTurnScreen';
import { RoundComplete } from './RoundComplete';
import { PassPhone } from './PassPhone';
import { QuestionDisplay } from './QuestionDisplay';
import { AnswerInput } from './AnswerInput';
import { JudgingScreen } from './JudgingScreen';
import { VoteScreen } from './VoteScreen';
import { VoteResults } from './VoteResults';
import { WheelScreen } from './WheelScreen';
import { RevealScreen } from './RevealScreen';
import { DareScreen } from './DareScreen';
import { DeepQuestion } from './DeepQuestion';
import { SecretMission } from './SecretMission';
import { Scoreboard } from '../scoreboard/Scoreboard';

export function GameController() {
  const { state } = useGame();

  const renderPhase = () => {
    switch (state.phase) {
      case 'round-intro':
        return <RoundIntro />;

      case 'player-turn':
        return <PlayerTurnScreen />;

      case 'round-complete':
        return <RoundComplete />;

      case 'pass-phone':
        return <PassPhone />;

      case 'question':
        return <QuestionDisplay />;

      case 'answer':
        return <AnswerInput />;

      case 'judging':
      case 'judging-worst':
        return <JudgingScreen />;

      case 'vote':
        return <VoteScreen />;

      case 'vote-results':
        return <VoteResults />;

      case 'wheel':
        return <WheelScreen />;

      case 'reveal':
        return <RevealScreen />;

      case 'dare':
        return <DareScreen />;

      case 'deep-question':
        return <DeepQuestion />;

      case 'secret-mission':
        return <SecretMission />;

      case 'scoreboard':
        return <Scoreboard />;

      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderPhase()}
    </AnimatePresence>
  );
}
