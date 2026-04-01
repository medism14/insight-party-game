import type { Party, PartyGame, PartyPlayer } from '../types/party';
import { generateId } from '../types/party';
import { getNextColor } from '../utils/colors';
import {
  readPersistentString,
  readPersistentValue,
  removePersistentValue,
  writePersistentString,
  writePersistentValue,
} from './browserStorage';

const PARTIES_KEY = 'insight_parties';
const CURRENT_PARTY_KEY = 'insight_current_party';
const GAMES_KEY = 'insight_games';

// Party Management
export function getParties(): Party[] {
  return readPersistentValue<Party[]>(PARTIES_KEY, []);
}

export function saveParties(parties: Party[]): void {
  writePersistentValue(PARTIES_KEY, parties);
}

export function createParty(name: string): Party {
  const party: Party = {
    id: generateId(),
    name,
    createdAt: Date.now(),
    players: [],
    currentGameId: null,
  };

  const parties = getParties();
  parties.push(party);
  saveParties(parties);

  return party;
}

export function getParty(partyId: string): Party | null {
  const parties = getParties();
  return parties.find(p => p.id === partyId) || null;
}

export function updateParty(party: Party): void {
  const parties = getParties();
  const index = parties.findIndex(p => p.id === party.id);
  if (index !== -1) {
    parties[index] = party;
    saveParties(parties);
  }
}

export function deleteParty(partyId: string): void {
  const parties = getParties();
  const filtered = parties.filter(p => p.id !== partyId);
  saveParties(filtered);

  // Also delete associated games
  const games = getGames();
  const filteredGames = games.filter(g => g.partyId !== partyId);
  saveGames(filteredGames);
}

// Current Party Session
export function getCurrentPartyId(): string | null {
  return readPersistentString(CURRENT_PARTY_KEY);
}

export function setCurrentPartyId(partyId: string | null): void {
  if (partyId) {
    writePersistentString(CURRENT_PARTY_KEY, partyId);
  } else {
    removePersistentValue(CURRENT_PARTY_KEY);
  }
}

export function getCurrentParty(): Party | null {
  const partyId = getCurrentPartyId();
  return partyId ? getParty(partyId) : null;
}

// Player Management
export function addPlayerToParty(partyId: string, name: string): PartyPlayer | null {
  const party = getParty(partyId);
  if (!party || party.players.length >= 12) return null;

  const player: PartyPlayer = {
    id: generateId(),
    name,
    color: getNextColor(),
  };

  party.players.push(player);
  updateParty(party);

  return player;
}

export function removePlayerFromParty(partyId: string, playerId: string): void {
  const party = getParty(partyId);
  if (!party) return;

  party.players = party.players.filter(p => p.id !== playerId);
  updateParty(party);
}

// Game Management
export function getGames(): PartyGame[] {
  return readPersistentValue<PartyGame[]>(GAMES_KEY, []);
}

export function saveGames(games: PartyGame[]): void {
  writePersistentValue(GAMES_KEY, games);
}

export function createGame(partyId: string, mode: string): PartyGame {
  const party = getParty(partyId);
  if (!party) throw new Error('Party not found');

  const game: PartyGame = {
    id: generateId(),
    partyId,
    mode,
    startedAt: Date.now(),
    completedAt: null,
    rounds: [],
    currentRoundIndex: 0,
    scores: {},
  };

  // Initialize scores for all players
  party.players.forEach(p => {
    game.scores[p.id] = 0;
  });

  const games = getGames();
  games.push(game);
  saveGames(games);

  // Update party with current game
  party.currentGameId = game.id;
  updateParty(party);

  return game;
}

export function getGame(gameId: string): PartyGame | null {
  const games = getGames();
  return games.find(g => g.id === gameId) || null;
}

export function updateGame(game: PartyGame): void {
  const games = getGames();
  const index = games.findIndex(g => g.id === game.id);
  if (index !== -1) {
    games[index] = game;
    saveGames(games);
  }
}

export function getCurrentGame(partyId: string): PartyGame | null {
  const party = getParty(partyId);
  if (!party || !party.currentGameId) return null;
  return getGame(party.currentGameId);
}

export function endCurrentGame(partyId: string): void {
  const party = getParty(partyId);
  if (!party || !party.currentGameId) return;

  const game = getGame(party.currentGameId);
  if (game) {
    game.completedAt = Date.now();
    updateGame(game);
  }

  party.currentGameId = null;
  updateParty(party);
}
