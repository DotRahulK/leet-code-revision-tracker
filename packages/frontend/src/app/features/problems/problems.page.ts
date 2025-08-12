import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';

import { DifficultyPillComponent } from '../../shared/ui/difficulty-pill/difficulty-pill.component';
import { TagChipComponent } from '../../shared/ui/tag-chip/tag-chip.component';
import { UiProblem, Difficulty } from '../../core/models';
import { ProblemsFacade } from '../../core/problems.facade';

@Component({
  selector: 'app-problems-page',
  standalone: true,
  imports: [
    // table + controls
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,

    // utils
    NgFor,

    // custom cells
    DifficultyPillComponent,
    TagChipComponent,
  ],
  templateUrl: './problems.page.html',
  styleUrls: ['./problems.page.scss'],
})
export class ProblemsPage implements OnInit, AfterViewInit {
  displayedColumns = ['title', 'tags', 'difficulty'];

  // MatTableDataSource to enable filter/sort/pagination
  problemsDS = new MatTableDataSource<UiProblem>([]);

  // filters
  difficulties = Object.values(Difficulty);
  search = '';
  selectedDifficulty: Difficulty | '' = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private facade = inject(ProblemsFacade);

  ngOnInit() {
    // Load data
    this.facade.list().subscribe(items => {
      this.problemsDS.data = items ?? [];
      this.applyFilters();
    });

    // Custom filter combining search + difficulty
    this.problemsDS.filterPredicate = (row, filterStr) => {
      let f: { search: string; difficulty: string };
      try {
        f = JSON.parse(filterStr || '{}');
      } catch {
        f = { search: '', difficulty: '' };
      }
      const s = (f.search || '').trim().toLowerCase();
      const d = (f.difficulty || '').toString();

      const matchesSearch =
        !s ||
        (row.title || '').toLowerCase().includes(s) ||
        (row.tags || []).some(t => (t || '').toLowerCase().includes(s));

      const matchesDifficulty = !d || row.difficulty === d;

      return matchesSearch && matchesDifficulty;
    };
  }

  ngAfterViewInit() {
    this.problemsDS.paginator = this.paginator;
    this.problemsDS.sort = this.sort;

    // Optional: default sort by title asc
    setTimeout(() => {
      if (this.sort) {
        this.sort.active = 'title';
        this.sort.direction = 'asc';
        this.sort.sortChange.emit({ active: 'title', direction: 'asc' });
      }
    });
  }

  // Handlers
  onSearch(val: string) {
    this.search = val ?? '';
    this.applyFilters(true);
  }

  onDifficultyChange(val: Difficulty | '') {
    this.selectedDifficulty = val ?? '';
    this.applyFilters(true);
  }

  clearFilters() {
    this.search = '';
    this.selectedDifficulty = '';
    this.applyFilters(true);
  }

  private applyFilters(resetPage = false) {
    this.problemsDS.filter = JSON.stringify({
      search: this.search,
      difficulty: this.selectedDifficulty,
    });

    if (resetPage && this.problemsDS.paginator) {
      this.problemsDS.paginator.firstPage();
    }
  }

  // TrackBy for tags in cell ngFor (perf)
  trackByTag = (_: number, t: string) => t;
}
