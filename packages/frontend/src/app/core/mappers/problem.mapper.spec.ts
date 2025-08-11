import { describe, it, expect } from 'vitest';
import { apiProblemToUi } from './problem.mapper';
import { Difficulty } from '../models';

describe('apiProblemToUi', () => {
  it('normalizes difficulty and tags', () => {
    const ui = apiProblemToUi({
      id: '1',
      slug: 'two-sum',
      title: 'Two Sum',
      difficulty: 'eAsY',
      tags: ['Array', 'Hash-Map']
    });
    expect(ui.difficulty).toBe(Difficulty.Easy);
    expect(ui.tags).toEqual(['array', 'hash-map']);
  });
});
