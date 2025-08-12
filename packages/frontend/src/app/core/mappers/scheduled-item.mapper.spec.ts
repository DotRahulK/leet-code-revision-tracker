import { describe, it, expect } from 'vitest';
import { apiScheduledItemToUi } from './scheduled-item.mapper';
import { Difficulty } from '../models';

describe('apiScheduledItemToUi', () => {
  it('maps scheduled item correctly', () => {
    const due = new Date().toISOString();
    const ui = apiScheduledItemToUi({
      id: 's1',
      type: 'NEXT_UP',
      problem: { id: 'p1', slug: 'two-sum', title: 'Two Sum', difficulty: 'Easy', tags: [] },
      dueAt: due,
      status: 'PLANNED'
    });
    expect(ui.problem.difficulty).toBe(Difficulty.Easy);
    expect(ui.dueAt).toBeInstanceOf(Date);
    expect(ui.type).toBe('NEXT_UP');
  });
});
