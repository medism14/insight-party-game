import type { ReactNode } from 'react';
import { GameContext } from './GameContext';
import { useGameState } from '../hooks/useGameState';

export function GameProvider({ children }: { children: ReactNode }) {
  const gameState = useGameState();

  return (
    <GameContext.Provider value={gameState}>
      {children}
    </GameContext.Provider>
  );
}
