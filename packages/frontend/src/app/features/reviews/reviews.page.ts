import {
  Component,
  OnInit,
  ViewChild,
  inject,
  AfterViewInit,
} from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AsyncPipe, NgFor, DatePipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { DifficultyPillComponent } from '../../shared/ui/difficulty-pill/difficulty-pill.component';
import { TagChipComponent } from '../../shared/ui/tag-chip/tag-chip.component';
import { ReviewsFacade } from '../../core/reviews.facade';
import { UiReview } from '../../core/models';
import { Observable } from 'rxjs';
import { RateDialogComponent } from '../../shared/ui/rate-dialog/rate-dialog.component';

@Component({
  selector: 'app-reviews-page',
  standalone: true,
  imports: [
    // table + controls
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,

    // buttons/icons/dialog
    MatButtonModule,
    MatDialogModule,
    MatIconModule,

    // utilities
    NgFor,
    AsyncPipe,
    DatePipe,

    // custom UI
    DifficultyPillComponent,
    TagChipComponent,
  ],
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit, AfterViewInit {
  // Columns are shared by both tables
  displayedColumns = ['title', 'tags', 'difficulty', 'due', 'actions'];

  // Due reviews (simple async pipe usage)
  reviews$!: Observable<UiReview[]>;

  // Unscored with data source, sorting, filtering, pagination
  unscoredDS = new MatTableDataSource<UiReview>([]);
  allTags: string[] = [];
  search = '';
  selectedTags: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private dialog = inject(MatDialog);
  private facade = inject(ReviewsFacade);

  ngOnInit() {
    // Load streams
    this.reviews$ = this.facade.getDueReviews();

    this.facade.getUnscored().subscribe(items => {
      const arr = items ?? [];
      this.unscoredDS.data = arr;

      // Build tag list dynamically
      const tagSet = new Set<string>();
      for (const r of arr) for (const t of r.problem.tags ?? []) tagSet.add(t);
      this.allTags = Array.from(tagSet).sort((a, b) => a.localeCompare(b));

      // Re-apply current filters
      this.applyFilters();
    });

    // Custom predicate that considers search + tag filters
    this.unscoredDS.filterPredicate = (row, raw) => {
      let parsed: { search: string; tags: string[] };
      try {
        parsed = JSON.parse(raw || '{}');
      } catch {
        parsed = { search: '', tags: [] };
      }
      const s = (parsed.search || '').trim().toLowerCase();
      const tags = parsed.tags || [];

      const title = (row.problem?.title || '').toLowerCase();
      const rowTags = (row.problem?.tags || []) as string[];

      const matchesSearch = !s || title.includes(s);
      const matchesTags =
        tags.length === 0 || tags.every(t => rowTags.includes(t));

      return matchesSearch && matchesTags;
    };
  }

  ngAfterViewInit() {
    // Hook paginator/sort after view init
    this.unscoredDS.paginator = this.paginator;
    this.unscoredDS.sort = this.sort;

    // Default sort by title asc (optional)
    setTimeout(() => {
      if (this.sort) {
        this.sort.active = 'title';
        this.sort.direction = 'asc';
        this.sort.sortChange.emit({ active: 'title', direction: 'asc' });
      }
    });
  }

  // Controls handlers
  onSearch(val: string) {
    this.search = val ?? '';
    this.applyFilters(true);
  }

  onTagsChange(tags: string[]) {
    this.selectedTags = tags ?? [];
    this.applyFilters(true);
  }

  clearFilters() {
    this.search = '';
    this.selectedTags = [];
    this.applyFilters(true);
  }

  private applyFilters(resetPage = false) {
    this.unscoredDS.filter = JSON.stringify({
      search: this.search,
      tags: this.selectedTags,
    });

    if (resetPage && this.unscoredDS.paginator) {
      this.unscoredDS.paginator.firstPage();
    }
  }

  rate(row: UiReview) {
    const ref = this.dialog.open(RateDialogComponent, {
      data: { title: row.problem.title },
    });
    ref.afterClosed().subscribe(quality => {
      if (quality != null) {
        this.facade.rateRecall(row.id, quality).subscribe(() => {
          // reload streams softly; paginator & sort remain intact
          this.reloadUnscored();
        });
      }
    });
  }

  private reloadUnscored() {
    this.facade.getUnscored().subscribe(items => {
      this.unscoredDS.data = items ?? [];
      this.applyFilters();
    });
  }

  // Perf-friendly trackBys
  trackById = (_: number, r: UiReview) => r.id;
  trackByTag = (_: number, t: string) => t;
}
