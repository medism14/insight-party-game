export interface Party {
  id: string;
  name: string;
  createdAt: number;
  players: PartyPlayer[];
  currentGameId: string | null;
}

export interface PartyPlayer {
  id: string;
  name: string;
  color: string;
  avatar?: string;
}

export interface PartyGame {
  id: string;
  partyId: string;
  mode: string;
  startedAt: number;
  completedAt: number | null;
  rounds: GameRound[];
  currentRoundIndex: number;
  scores: Record<string, number>;
}

export interface GameRound {
  roundNumber: number;
  playerTurns: PlayerTurn[];
  completedAt: number | null;
}

export interface PlayerTurn {
  playerId: string;
  questionId: number;
  questionText: string;
  coinFlipResult: 'heads' | 'tails' | null;
  coinFlipChoice: 'heads' | 'tails' | null;
  won: boolean | null;
  completedAt: number | null;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}
