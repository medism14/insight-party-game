export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function pickRandomExcluding<T>(array: T[], exclude: Set<number>, idGetter: (item: T) => number): T | null {
  const available = array.filter(item => !exclude.has(idGetter(item)));
  if (available.length === 0) return null;
  return pickRandom(available);
}
