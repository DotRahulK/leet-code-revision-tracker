import { UiScheduledItem } from '../models';
import { apiProblemToUi } from './problem.mapper';

export function apiScheduledItemToUi(si: any): UiScheduledItem {
  return {
    id: si.id,
    type: si.type,
    problem: apiProblemToUi(si.problem),
    dueAt: new Date(si.dueAt),
    status: si.status,
  };
}
