import { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import type { GameStateHook } from './useGameState';

export function useGame(): GameStateHook {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
