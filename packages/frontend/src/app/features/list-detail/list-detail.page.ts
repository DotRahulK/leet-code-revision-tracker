import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { DifficultyPillComponent } from '../../shared/ui/difficulty-pill/difficulty-pill.component';
import { TagChipComponent } from '../../shared/ui/tag-chip/tag-chip.component';
import { ListsFacade } from '../../core/lists.facade';
import { UiList } from '../../core/models';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';

type Row = {
  id: string | number;
  title: string;
  tags: string[];
  difficulty: string;
};

@Component({
  selector: 'app-list-detail-page',
  standalone: true,
  imports: [
    MatTableModule,
    NgFor, NgIf, AsyncPipe,
    DifficultyPillComponent,
    TagChipComponent,
  ],
  templateUrl: './list-detail.page.html',
  styleUrls: ['./list-detail.page.scss'],
})
export class ListDetailPage {
  private facade = inject(ListsFacade);
  private route = inject(ActivatedRoute);

  displayedColumns = ['title', 'tags', 'difficulty'];

  // Load the list reactively when the route param changes
  list$: Observable<UiList> = this.route.paramMap.pipe(
    map(params => params.get('id')!),
    switchMap(id => this.facade.getList(id))
  );

  // Normalize items -> rows (supports either list.items[] or list.problems[])
  rows$: Observable<Row[]> = this.list$.pipe(
    map(list => {
      const items = (list as any).items ?? (list as any).problems ?? [];
      return (items as any[]).map((it: any) => {
        // Support both shapes: either the item already has title/tags/difficulty,
        // or they live under item.problem.*
        const src = it.problem ?? it;
        return {
          id: it.id ?? src.id ?? src.slug ?? src.title,
          title: src.title ?? '',
          tags: src.tags ?? [],
          difficulty: src.difficulty ?? 'Unknown',
        } as Row;
      });
    })
  );

  trackById = (_: number, r: Row) => r.id;
  trackByTag = (_: number, t: string) => t;
}
