import { useReducer, useCallback } from 'react';
import type { GameState, GameAction, GamePhase, GameMode, Player, PlayerAnswer, Vote, Question } from '../types/game';
import { GAME_MODES } from '../types/game';
import { getNextColor, resetColorIndex } from '../utils/colors';

const initialState: GameState = {
  phase: 'home',
  mode: null,
  players: [],
  // Party system
  currentPartyId: null,
  currentPartyName: null,
  // Turn-based system
  currentPlayerIndex: -1,
  playersPlayedThisRound: [],
  currentQuestion: null,
  // Coin flip
  coinFlipChoice: null,
  coinFlipResult: null,
  lastTurnWon: null,
  // Legacy fields
  currentJudgeIndex: 0,
  currentRespondentIndex: 0,
  currentAnswers: [],
  currentVotes: [],
  currentRound: 0,
  totalRounds: 1,
  usedQuestionIds: new Set(),
  selectedBestAnswerId: null,
  selectedWorstAnswerId: null,
  wheelResult: null,
  secretMission: null,
  showWarning: false,
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function getRandomUnplayedPlayerIndex(players: Player[], playersPlayedIds: string[]): number {
  const unplayedIndices = players
    .map((p, i) => ({ id: p.id, index: i }))
    .filter(p => !playersPlayedIds.includes(p.id))
    .map(p => p.index);

  if (unplayedIndices.length === 0) return -1;
  return unplayedIndices[Math.floor(Math.random() * unplayedIndices.length)];
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.payload };

    case 'ADD_PLAYER': {
      if (state.players.length >= 12) return state;
      const newPlayer: Player = {
        id: generateId(),
        name: action.payload.name,
        color: getNextColor(),
        score: 0,
      };
      return { ...state, players: [...state.players, newPlayer] };
    }

    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.payload),
      };

    // Party actions
    case 'SET_PARTY':
      return {
        ...state,
        currentPartyId: action.payload.id,
        currentPartyName: action.payload.name,
      };

    case 'CLEAR_PARTY':
      return {
        ...state,
        currentPartyId: null,
        currentPartyName: null,
        players: [],
      };

    case 'LOAD_PARTY_PLAYERS':
      return {
        ...state,
        players: action.payload,
      };

    case 'SELECT_MODE': {
      const showWarning = action.payload === 'hooot';
      return {
        ...state,
        mode: action.payload,
        showWarning,
        phase: showWarning ? 'mode-select' : 'round-intro',
        currentRound: 1,
        currentPlayerIndex: -1,
        playersPlayedThisRound: [],
        currentJudgeIndex: 0,
        currentRespondentIndex: 0,
        usedQuestionIds: new Set(),
        coinFlipChoice: null,
        coinFlipResult: null,
        lastTurnWon: null,
      };
    }

    case 'SET_TOTAL_ROUNDS':
      return { ...state, totalRounds: action.payload };

    case 'START_ROUND':
      return {
        ...state,
        playersPlayedThisRound: [],
        currentPlayerIndex: -1,
        currentAnswers: [],
        currentVotes: [],
        selectedBestAnswerId: null,
        selectedWorstAnswerId: null,
        wheelResult: null,
        coinFlipChoice: null,
        coinFlipResult: null,
        lastTurnWon: null,
      };

    // New turn-based actions
    case 'PICK_RANDOM_PLAYER': {
      const randomIndex = getRandomUnplayedPlayerIndex(state.players, state.playersPlayedThisRound);
      return {
        ...state,
        currentPlayerIndex: randomIndex,
        coinFlipChoice: null,
        coinFlipResult: null,
        lastTurnWon: null,
      };
    }

    case 'START_PLAYER_TURN': {
      const newUsedIds = new Set(state.usedQuestionIds);
      newUsedIds.add(action.payload.question.id);
      return {
        ...state,
        currentPlayerIndex: action.payload.playerIndex,
        currentQuestion: action.payload.question,
        usedQuestionIds: newUsedIds,
        coinFlipChoice: null,
        coinFlipResult: null,
        lastTurnWon: null,
      };
    }

    case 'SET_COIN_FLIP_CHOICE':
      return {
        ...state,
        coinFlipChoice: action.payload,
        ...(action.payload === null ? { coinFlipResult: null, lastTurnWon: null } : {}),
      };

    case 'SET_COIN_FLIP_RESULT': {
      if (action.payload === null) {
        return {
          ...state,
          coinFlipResult: null,
          lastTurnWon: null,
        };
      }

      const won = state.coinFlipChoice === action.payload;
      return {
        ...state,
        coinFlipResult: action.payload,
        lastTurnWon: won,
      };
    }

    case 'COMPLETE_PLAYER_TURN': {
      const currentPlayer = state.players[state.currentPlayerIndex];
      if (!currentPlayer) return state;

      const newPlayersPlayed = [...state.playersPlayedThisRound, currentPlayer.id];

      // Award points if won
      let updatedPlayers = state.players;
      if (state.lastTurnWon) {
        updatedPlayers = state.players.map(p =>
          p.id === currentPlayer.id ? { ...p, score: p.score + 1 } : p
        );
      }

      return {
        ...state,
        players: updatedPlayers,
        playersPlayedThisRound: newPlayersPlayed,
      };
    }

    case 'NEXT_PLAYER_TURN': {
      // Check if all players have played
      if (state.playersPlayedThisRound.length >= state.players.length) {
        return {
          ...state,
          phase: 'round-complete',
        };
      }

      const randomIndex = getRandomUnplayedPlayerIndex(state.players, state.playersPlayedThisRound);
      return {
        ...state,
        currentPlayerIndex: randomIndex,
        currentQuestion: null,
        coinFlipChoice: null,
        coinFlipResult: null,
        lastTurnWon: null,
        phase: 'player-turn',
      };
    }

    case 'SET_QUESTION': {
      if (action.payload === null) {
        return {
          ...state,
          currentQuestion: null,
        };
      }

      const newUsedIds = new Set(state.usedQuestionIds);
      newUsedIds.add(action.payload.id);
      return {
        ...state,
        currentQuestion: action.payload,
        usedQuestionIds: newUsedIds,
      };
    }

    case 'NEXT_RESPONDENT': {
      let nextIndex = state.currentRespondentIndex + 1;
      const modeConfig = GAME_MODES.find(m => m.id === state.mode);

      if (modeConfig?.hasJudge) {
        if (nextIndex === state.currentJudgeIndex) {
          nextIndex++;
        }
      }

      return { ...state, currentRespondentIndex: nextIndex };
    }

    case 'SUBMIT_ANSWER':
      return {
        ...state,
        currentAnswers: [...state.currentAnswers, action.payload],
      };

    case 'SELECT_BEST_ANSWER':
      return { ...state, selectedBestAnswerId: action.payload };

    case 'SELECT_WORST_ANSWER':
      return { ...state, selectedWorstAnswerId: action.payload };

    case 'CAST_VOTE':
      return {
        ...state,
        currentVotes: [...state.currentVotes, action.payload],
      };

    case 'FINALIZE_VOTES': {
      return state;
    }

    case 'SPIN_WHEEL':
      return { ...state, wheelResult: action.payload };

    case 'SET_MISSION':
      return { ...state, secretMission: action.payload };

    case 'AWARD_POINTS': {
      const updatedPlayers = state.players.map(p =>
        p.id === action.payload.playerId
          ? { ...p, score: p.score + action.payload.points }
          : p
      );
      return { ...state, players: updatedPlayers };
    }

    case 'NEXT_ROUND': {
      const nextRound = state.currentRound + 1;
      if (nextRound > state.totalRounds) {
        return { ...state, phase: 'scoreboard' };
      }
      return {
        ...state,
        currentRound: nextRound,
        currentQuestion: null,
        currentPlayerIndex: -1,
        playersPlayedThisRound: [],
        currentAnswers: [],
        currentVotes: [],
        selectedBestAnswerId: null,
        selectedWorstAnswerId: null,
        wheelResult: null,
        currentRespondentIndex: 0,
        coinFlipChoice: null,
        coinFlipResult: null,
        lastTurnWon: null,
      };
    }

    case 'NEXT_JUDGE': {
      const nextJudge = (state.currentJudgeIndex + 1) % state.players.length;
      return {
        ...state,
        currentJudgeIndex: nextJudge,
        currentRespondentIndex: 0,
      };
    }

    case 'DISMISS_WARNING':
      return { ...state, showWarning: false, phase: 'round-intro' };

    case 'CANCEL_MODE_WARNING':
      return { ...state, mode: null, showWarning: false };

    case 'RESET_ROUND':
      return {
        ...state,
        playersPlayedThisRound: [],
        currentPlayerIndex: -1,
        currentAnswers: [],
        currentVotes: [],
        selectedBestAnswerId: null,
        selectedWorstAnswerId: null,
        wheelResult: null,
        currentRespondentIndex: 0,
        coinFlipChoice: null,
        coinFlipResult: null,
        lastTurnWon: null,
      };

    case 'RESET_GAME':
      resetColorIndex();
      return {
        ...initialState,
        currentPartyId: state.currentPartyId,
        currentPartyName: state.currentPartyName,
        players: state.players,
      };

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setPhase = useCallback((phase: GamePhase) => {
    dispatch({ type: 'SET_PHASE', payload: phase });
  }, []);

  const addPlayer = useCallback((name: string) => {
    dispatch({ type: 'ADD_PLAYER', payload: { name } });
  }, []);

  const removePlayer = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: id });
  }, []);

  // Party functions
  const setParty = useCallback((id: string, name: string) => {
    dispatch({ type: 'SET_PARTY', payload: { id, name } });
  }, []);

  const clearParty = useCallback(() => {
    dispatch({ type: 'CLEAR_PARTY' });
  }, []);

  const loadPartyPlayers = useCallback((players: Player[]) => {
    dispatch({ type: 'LOAD_PARTY_PLAYERS', payload: players });
  }, []);

  const selectMode = useCallback((mode: GameMode) => {
    dispatch({ type: 'SELECT_MODE', payload: mode });
  }, []);

  const setTotalRounds = useCallback((rounds: number) => {
    dispatch({ type: 'SET_TOTAL_ROUNDS', payload: rounds });
  }, []);

  const startRound = useCallback(() => {
    dispatch({ type: 'START_ROUND' });
  }, []);

  // New turn-based functions
  const pickRandomPlayer = useCallback(() => {
    dispatch({ type: 'PICK_RANDOM_PLAYER' });
  }, []);

  const startPlayerTurn = useCallback((playerIndex: number, question: Question) => {
    dispatch({ type: 'START_PLAYER_TURN', payload: { playerIndex, question } });
  }, []);

  const setCoinFlipChoice = useCallback((choice: 'heads' | 'tails' | null) => {
    dispatch({ type: 'SET_COIN_FLIP_CHOICE', payload: choice });
  }, []);

  const setCoinFlipResult = useCallback((result: 'heads' | 'tails' | null) => {
    dispatch({ type: 'SET_COIN_FLIP_RESULT', payload: result });
  }, []);

  const completePlayerTurn = useCallback(() => {
    dispatch({ type: 'COMPLETE_PLAYER_TURN' });
  }, []);

  const nextPlayerTurn = useCallback(() => {
    dispatch({ type: 'NEXT_PLAYER_TURN' });
  }, []);

  const setQuestion = useCallback((question: Question | null) => {
    dispatch({ type: 'SET_QUESTION', payload: question });
  }, []);

  const nextRespondent = useCallback(() => {
    dispatch({ type: 'NEXT_RESPONDENT' });
  }, []);

  const submitAnswer = useCallback((answer: PlayerAnswer) => {
    dispatch({ type: 'SUBMIT_ANSWER', payload: answer });
  }, []);

  const selectBestAnswer = useCallback((playerId: string) => {
    dispatch({ type: 'SELECT_BEST_ANSWER', payload: playerId });
  }, []);

  const selectWorstAnswer = useCallback((playerId: string) => {
    dispatch({ type: 'SELECT_WORST_ANSWER', payload: playerId });
  }, []);

  const castVote = useCallback((vote: Vote) => {
    dispatch({ type: 'CAST_VOTE', payload: vote });
  }, []);

  const finalizeVotes = useCallback(() => {
    dispatch({ type: 'FINALIZE_VOTES' });
  }, []);

  const spinWheel = useCallback((result: string) => {
    dispatch({ type: 'SPIN_WHEEL', payload: result });
  }, []);

  const setMission = useCallback((mission: string) => {
    dispatch({ type: 'SET_MISSION', payload: mission });
  }, []);

  const awardPoints = useCallback((playerId: string, points: number) => {
    dispatch({ type: 'AWARD_POINTS', payload: { playerId, points } });
  }, []);

  const nextRound = useCallback(() => {
    dispatch({ type: 'NEXT_ROUND' });
  }, []);

  const nextJudge = useCallback(() => {
    dispatch({ type: 'NEXT_JUDGE' });
  }, []);

  const dismissWarning = useCallback(() => {
    dispatch({ type: 'DISMISS_WARNING' });
  }, []);

  const cancelModeWarning = useCallback(() => {
    dispatch({ type: 'CANCEL_MODE_WARNING' });
  }, []);

  const resetRound = useCallback(() => {
    dispatch({ type: 'RESET_ROUND' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const getCurrentJudge = useCallback((): Player | null => {
    return state.players[state.currentJudgeIndex] || null;
  }, [state.players, state.currentJudgeIndex]);

  const getCurrentPlayer = useCallback((): Player | null => {
    return state.players[state.currentPlayerIndex] || null;
  }, [state.players, state.currentPlayerIndex]);

  const getCurrentRespondent = useCallback((): Player | null => {
    return state.players[state.currentRespondentIndex] || null;
  }, [state.players, state.currentRespondentIndex]);

  const getRespondents = useCallback((): Player[] => {
    const modeConfig = GAME_MODES.find(m => m.id === state.mode);
    if (modeConfig?.hasJudge) {
      return state.players.filter((_, i) => i !== state.currentJudgeIndex);
    }
    return state.players;
  }, [state.players, state.currentJudgeIndex, state.mode]);

  const getModeConfig = useCallback(() => {
    return GAME_MODES.find(m => m.id === state.mode) || null;
  }, [state.mode]);

  const getLeaderboard = useCallback(() => {
    return [...state.players].sort((a, b) => b.score - a.score);
  }, [state.players]);

  const getPlayersRemaining = useCallback((): number => {
    return state.players.length - state.playersPlayedThisRound.length;
  }, [state.players.length, state.playersPlayedThisRound.length]);

  const hasAllPlayersPlayed = useCallback((): boolean => {
    return state.playersPlayedThisRound.length >= state.players.length;
  }, [state.playersPlayedThisRound.length, state.players.length]);

  return {
    state,
    dispatch,
    setPhase,
    addPlayer,
    removePlayer,
    setParty,
    clearParty,
    loadPartyPlayers,
    selectMode,
    setTotalRounds,
    startRound,
    pickRandomPlayer,
    startPlayerTurn,
    setCoinFlipChoice,
    setCoinFlipResult,
    completePlayerTurn,
    nextPlayerTurn,
    setQuestion,
    nextRespondent,
    submitAnswer,
    selectBestAnswer,
    selectWorstAnswer,
    castVote,
    finalizeVotes,
    spinWheel,
    setMission,
    awardPoints,
    nextRound,
    nextJudge,
    dismissWarning,
    cancelModeWarning,
    resetRound,
    resetGame,
    getCurrentJudge,
    getCurrentPlayer,
    getCurrentRespondent,
    getRespondents,
    getModeConfig,
    getLeaderboard,
    getPlayersRemaining,
    hasAllPlayersPlayed,
  };
}

export type GameStateHook = ReturnType<typeof useGameState>;
