import { UiProblem } from './ui-problem';

export interface UiScheduledItem {
  id: string;
  type: 'NEXT_UP' | 'REVISION';
  problem: UiProblem;
  dueAt: Date;
  status: 'PLANNED' | 'DONE' | 'CANCELLED';
}
