import { UiProblem } from './ui-problem';

export interface UiReview {
  id: string;
  problem: UiProblem;
  nextReviewAt: Date | null;
  overdue: boolean;
  notes?: string | null;
  lastSolutionCode?: string | null;
}
