import { describe, it, expect, vi } from 'vitest';
import { apiReviewToUi } from './review.mapper';
import { Difficulty } from '../models';

describe('apiReviewToUi', () => {
  it('maps problem and overdue flag', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const ui = apiReviewToUi({
      id: 'up1',
      problem: { id: '1', slug: 'two-sum', title: 'Two Sum', difficulty: 'Medium', tags: [] },
      nextReviewAt: past
    });
    expect(ui.problem.difficulty).toBe(Difficulty.Medium);
    expect(ui.overdue).toBe(true);
    expect(ui.nextReviewAt).toBeInstanceOf(Date);
  });
});
