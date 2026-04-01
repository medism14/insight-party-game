export type GameMode = 'classic' | 'blackout' | 'spicy' | 'deep' | 'battle' | 'trouble' | 'hooot' | 'trash';

export type GamePhase =
  | 'home'
  | 'party-select'
  | 'party-lobby'
  | 'setup'
  | 'mode-select'
  | 'round-intro'
  | 'player-turn'
  | 'question'
  | 'pass-phone'
  | 'answer'
  | 'coin-flip'
  | 'turn-result'
  | 'judging'
  | 'judging-worst'
  | 'vote'
  | 'vote-results'
  | 'wheel'
  | 'reveal'
  | 'dare'
  | 'secret-mission'
  | 'deep-question'
  | 'round-complete'
  | 'scoreboard';

export interface Player {
  id: string;
  name: string;
  color: string;
  score: number;
}

export interface PlayerAnswer {
  playerId: string;
  answer: string;
}

export interface Vote {
  voterId: string;
  votedForId: string;
}

export interface Question {
  id: number;
  text: string;
  category?: string;
}

export interface GameModeConfig {
  id: GameMode;
  name: string;
  description: string;
  icon: string;
  color: string;
  colorClass: string;
  hasScoring: boolean;
  hasJudge: boolean;
  hasVoting: boolean;
  hasWheel: boolean;
  minPlayers: number;
  pointsForBest: number;
  pointsForWorst: number;
}

export interface GameState {
  phase: GamePhase;
  mode: GameMode | null;
  players: Player[];
  // Party system
  currentPartyId: string | null;
  currentPartyName: string | null;
  // Turn-based system
  currentPlayerIndex: number;
  playersPlayedThisRound: string[];
  currentQuestion: Question | null;
  // Coin flip
  coinFlipChoice: 'heads' | 'tails' | null;
  coinFlipResult: 'heads' | 'tails' | null;
  lastTurnWon: boolean | null;
  // Legacy fields for backward compatibility
  currentJudgeIndex: number;
  currentRespondentIndex: number;
  currentAnswers: PlayerAnswer[];
  currentVotes: Vote[];
  currentRound: number;
  totalRounds: number;
  usedQuestionIds: Set<number>;
  selectedBestAnswerId: string | null;
  selectedWorstAnswerId: string | null;
  wheelResult: string | null;
  secretMission: string | null;
  showWarning: boolean;
}

export type GameAction =
  | { type: 'SET_PHASE'; payload: GamePhase }
  | { type: 'ADD_PLAYER'; payload: { name: string } }
  | { type: 'REMOVE_PLAYER'; payload: string }
  | { type: 'SELECT_MODE'; payload: GameMode }
  | { type: 'SET_TOTAL_ROUNDS'; payload: number }
  | { type: 'START_ROUND' }
  | { type: 'SET_QUESTION'; payload: Question }
  | { type: 'NEXT_RESPONDENT' }
  | { type: 'SUBMIT_ANSWER'; payload: PlayerAnswer }
  | { type: 'SELECT_BEST_ANSWER'; payload: string }
  | { type: 'SELECT_WORST_ANSWER'; payload: string }
  | { type: 'CAST_VOTE'; payload: Vote }
  | { type: 'FINALIZE_VOTES' }
  | { type: 'SPIN_WHEEL'; payload: string }
  | { type: 'SET_MISSION'; payload: string }
  | { type: 'AWARD_POINTS'; payload: { playerId: string; points: number } }
  | { type: 'NEXT_ROUND' }
  | { type: 'NEXT_JUDGE' }
  | { type: 'DISMISS_WARNING' }
  | { type: 'CANCEL_MODE_WARNING' }
  | { type: 'RESET_GAME' }
  | { type: 'RESET_ROUND' }
  // Party actions
  | { type: 'SET_PARTY'; payload: { id: string; name: string } }
  | { type: 'CLEAR_PARTY' }
  | { type: 'LOAD_PARTY_PLAYERS'; payload: Player[] }
  // New turn-based actions
  | { type: 'START_PLAYER_TURN'; payload: { playerIndex: number; question: Question } }
  | { type: 'SET_COIN_FLIP_CHOICE'; payload: 'heads' | 'tails' }
  | { type: 'SET_COIN_FLIP_RESULT'; payload: 'heads' | 'tails' }
  | { type: 'COMPLETE_PLAYER_TURN' }
  | { type: 'PICK_RANDOM_PLAYER' }
  | { type: 'NEXT_PLAYER_TURN' };

export const AVATAR_COLORS = [
  '#8B5CF6', // violet
  '#EC4899', // rose
  '#3B82F6', // bleu
  '#10B981', // vert
  '#F97316', // orange
  '#EF4444', // rouge
  '#06B6D4', // cyan
  '#F59E0B', // ambre
  '#84CC16', // lime
  '#6366F1', // indigo
  '#14B8A6', // teal
  '#D946EF', // fuchsia
];

export const GAME_MODES: GameModeConfig[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Le juge choisit sa reponse preferee',
    icon: '🎯',
    color: '#8B5CF6',
    colorClass: 'bg-classic',
    hasScoring: true,
    hasJudge: true,
    hasVoting: false,
    hasWheel: false,
    minPlayers: 2,
    pointsForBest: 1,
    pointsForWorst: 0,
  },
  {
    id: 'blackout',
    name: 'Blackout',
    description: 'Meilleure ET pire reponse + gages',
    icon: '🎰',
    color: '#374151',
    colorClass: 'bg-blackout',
    hasScoring: true,
    hasJudge: true,
    hasVoting: false,
    hasWheel: true,
    minPlayers: 3,
    pointsForBest: 2,
    pointsForWorst: -1,
  },
  {
    id: 'spicy',
    name: 'Spicy',
    description: 'Qui est le plus... ? Votez !',
    icon: '🌶️',
    color: '#EC4899',
    colorClass: 'bg-spicy',
    hasScoring: false,
    hasJudge: false,
    hasVoting: true,
    hasWheel: false,
    minPlayers: 3,
    pointsForBest: 0,
    pointsForWorst: 0,
  },
  {
    id: 'deep',
    name: 'Deep',
    description: 'Questions philosophiques',
    icon: '🧠',
    color: '#3B82F6',
    colorClass: 'bg-deep',
    hasScoring: false,
    hasJudge: false,
    hasVoting: false,
    hasWheel: false,
    minPlayers: 2,
    pointsForBest: 0,
    pointsForWorst: 0,
  },
  {
    id: 'battle',
    name: 'Battle',
    description: 'Completez la phrase, votez pour la meilleure',
    icon: '⚔️',
    color: '#10B981',
    colorClass: 'bg-battle',
    hasScoring: true,
    hasJudge: false,
    hasVoting: true,
    hasWheel: false,
    minPlayers: 3,
    pointsForBest: 2,
    pointsForWorst: 0,
  },
  {
    id: 'trouble',
    name: 'Trouble',
    description: 'Missions secretes a accomplir',
    icon: '🎭',
    color: '#F97316',
    colorClass: 'bg-trouble',
    hasScoring: false,
    hasJudge: false,
    hasVoting: false,
    hasWheel: false,
    minPlayers: 3,
    pointsForBest: 0,
    pointsForWorst: 0,
  },
  {
    id: 'hooot',
    name: 'Hooot',
    description: 'Questions intimes et audacieuses',
    icon: '🔥',
    color: '#DC2626',
    colorClass: 'bg-hooot',
    hasScoring: false,
    hasJudge: false,
    hasVoting: true,
    hasWheel: false,
    minPlayers: 3,
    pointsForBest: 0,
    pointsForWorst: 0,
  },
  {
    id: 'trash',
    name: 'Trash',
    description: 'Questions absurdes et delirantes',
    icon: '🗑️',
    color: '#84CC16',
    colorClass: 'bg-trash',
    hasScoring: false,
    hasJudge: false,
    hasVoting: true,
    hasWheel: false,
    minPlayers: 3,
    pointsForBest: 0,
    pointsForWorst: 0,
  },
];
