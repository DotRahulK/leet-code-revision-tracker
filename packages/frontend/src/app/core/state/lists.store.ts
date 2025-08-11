import { signal } from '@angular/core';

export const listsStore = {
  items: signal([] as any[]),
  loading: signal(false),
  error: signal<string | null>(null)
};
