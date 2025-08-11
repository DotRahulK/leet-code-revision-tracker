import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { DifficultyPillComponent } from '../../shared/ui/difficulty-pill/difficulty-pill.component';
import { TagChipComponent } from '../../shared/ui/tag-chip/tag-chip.component';
import { ListsFacade } from '../../core/lists.facade';
import { UiList } from '../../core/models';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-detail-page',
  standalone: true,
  imports: [MatTableModule, NgFor, NgIf, AsyncPipe, DifficultyPillComponent, TagChipComponent],
  templateUrl: './list-detail.page.html',
  styleUrls: ['./list-detail.page.scss']
})
export class ListDetailPage implements OnInit {
  displayedColumns = ['title', 'tags', 'difficulty'];
  list$!: Observable<UiList>;

  constructor(private facade: ListsFacade, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.list$ = this.facade.getList(id);
  }
}
