import { UiList } from '../models';

export function apiListToUi(list: any): UiList {
  return {
    id: list.id,
    name: list.name,
    source: list.source,
    scheduled: !!list.scheduled
  };
}
