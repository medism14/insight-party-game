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
import { GameStateFallback } from './GameStateFallback';

export function GameController() {
  const { state, setPhase, resetGame, getModeConfig } = useGame();
  const modeConfig = getModeConfig();

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
        return (
          <GameStateFallback
            title="Cet ecran ne peut pas s'afficher"
            description={`La partie est arrivee sur une etape inconnue (${state.phase}). On peut revenir au tour en cours ou relancer la partie sans laisser l'interface vide.`}
            primaryLabel="Revenir au tour"
            onPrimary={() => setPhase('round-intro')}
            secondaryLabel="Retour a l'accueil"
            onSecondary={resetGame}
            color={modeConfig?.color}
          />
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderPhase()}
    </AnimatePresence>
  );
}
