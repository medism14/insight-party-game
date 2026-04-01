import { createContext } from 'react';
import type { GameStateHook } from '../hooks/useGameState';

export const GameContext = createContext<GameStateHook | null>(null);
