import type { Question, GameMode } from '../types/game';
import { classicQuestions } from './questions-classic';
import { spicyQuestions } from './questions-spicy';
import { deepQuestions } from './questions-deep';
import { hoootQuestions } from './questions-hooot';
import { trashQuestions } from './questions-trash';
import { battleSentences } from './sentences-battle';
import { troubleMissions } from './missions-trouble';
import { blackoutDares } from './dares-blackout';

const troublePrompts: Question[] = troubleMissions.map((mission) => ({
  id: mission.id,
  text: mission.text,
  category: `Trouble ${mission.difficulty}`,
}));

export function getQuestionsForMode(mode: GameMode): Question[] {
  switch (mode) {
    case 'classic':
    case 'blackout':
      return classicQuestions;
    case 'spicy':
      return spicyQuestions;
    case 'deep':
      return deepQuestions;
    case 'hooot':
      return hoootQuestions;
    case 'trash':
      return trashQuestions;
    case 'battle':
      return battleSentences;
    case 'trouble':
      return troublePrompts;
    default:
      return [];
  }
}

export function getDares() {
  return blackoutDares;
}

export function getMissions() {
  return troubleMissions;
}

export {
  classicQuestions,
  spicyQuestions,
  deepQuestions,
  hoootQuestions,
  trashQuestions,
  battleSentences,
  troubleMissions,
  blackoutDares,
  troublePrompts,
};
