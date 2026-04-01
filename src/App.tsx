import { AnimatePresence } from 'framer-motion';
import { GameProvider } from './context/GameProvider';
import { useGame } from './hooks/useGame';
import { HomeScreen } from './components/home/HomeScreen';
import { PartySelect } from './components/party/PartySelect';
import { PartyLobby } from './components/party/PartyLobby';
import { PlayerSetup } from './components/setup/PlayerSetup';
import { ModeSelect } from './components/setup/ModeSelect';
import { GameController } from './components/game/GameController';

function GameApp() {
  const { state } = useGame();

  const renderScreen = () => {
    switch (state.phase) {
      case 'home':
        return <HomeScreen key="home" />;
      case 'party-select':
        return <PartySelect key="party-select" />;
      case 'party-lobby':
        return <PartyLobby key="party-lobby" />;
      case 'setup':
        return <PlayerSetup key="setup" />;
      case 'mode-select':
        return <ModeSelect key="mode-select" />;
      default:
        return <GameController key="game" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}

export default App;
