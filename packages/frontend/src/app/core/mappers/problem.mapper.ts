import { Difficulty, UiProblem } from '../models';

export function apiProblemToUi(p: any): UiProblem {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    difficulty: normalizeDifficulty(p.difficulty),
    tags: (p.tags || []).map((t: string) => t.toLowerCase()),
    description: p.description ?? null
  };
}

function normalizeDifficulty(d: string): Difficulty {
  switch ((d || '').toLowerCase()) {
    case 'easy':
      return Difficulty.Easy;
    case 'medium':
      return Difficulty.Medium;
    case 'hard':
      return Difficulty.Hard;
    default:
      return Difficulty.Easy;
  }
}
