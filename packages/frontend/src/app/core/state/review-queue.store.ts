import { signal } from '@angular/core';

export const reviewQueueStore = {
  items: signal([] as any[])
};
