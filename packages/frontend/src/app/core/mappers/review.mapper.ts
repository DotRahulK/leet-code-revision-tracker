import { UiReview } from '../models';
import { apiProblemToUi } from './problem.mapper';

export function apiReviewToUi(up: any): UiReview {
  const next = up.nextReviewAt ? new Date(up.nextReviewAt) : null;
  const now = new Date();
  return {
    id: up.id,
    problem: apiProblemToUi(up.problem),
    nextReviewAt: next,
    overdue: next ? next < now : false,
    notes: up.notes ?? null,
    lastSolutionCode: up.lastSolutionCode ?? null
  };
}
