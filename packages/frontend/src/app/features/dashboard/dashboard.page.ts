import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgFor, NgIf } from '@angular/common';
import { ReviewsFacade } from '../../core/reviews.facade';
import { ListsFacade } from '../../core/lists.facade';
import { ScheduledFacade } from '../../core/scheduled.facade';
import { UiScheduledItem } from '../../core/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type Stat = { key: 'solved' | 'due' | 'over' | 'lists'; label: string; value: number; icon: string };

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatListModule, NgFor, NgIf],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  stats: Stat[] = [
    { key: 'solved', label: 'Solved',     value: 0, icon: 'task_alt' },
    { key: 'due',    label: 'Due Today',  value: 0, icon: 'schedule' },
    { key: 'over',   label: 'Overdue',    value: 0, icon: 'warning' },
    { key: 'lists',  label: 'Lists',      value: 0, icon: 'list_alt' }
  ];

  upcoming: UiScheduledItem[] = [];
  dueToday: UiScheduledItem[] = [];

  constructor(
    private reviews: ReviewsFacade,
    private lists: ListsFacade,
    private scheduled: ScheduledFacade,
  ) {}

  ngOnInit() {
    this.reviews.getDueReviews()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        const arr = res ?? [];
        this.stats[1].value = arr.length;                            // Due Today
        this.stats[2].value = arr.filter(r => (r as any)?.overdue).length; // Overdue
      });

    this.lists.getLists()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.stats[3].value = (res ?? []).length; // Lists
      });
    this.scheduled.getScheduled()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        const endToday = new Date();
        endToday.setHours(23, 59, 59, 999);
        const planned = (res ?? []).filter(r => r.status === 'PLANNED');
        this.dueToday = planned.filter(r => r.dueAt <= endToday);
        this.upcoming = planned
          .filter(r => r.dueAt > endToday)
          .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())
          .slice(0, 3);
      });

    // TODO: when you have a solved-count source, set this.stats[0].value here.
  }

  trackByLabel = (_: number, s: Stat) => s.label;
  trackByItem = (_: number, i: UiScheduledItem) => i.id;
}
