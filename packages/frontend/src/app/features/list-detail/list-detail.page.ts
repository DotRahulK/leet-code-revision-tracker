import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NgFor } from '@angular/common';
import { DifficultyPillComponent } from '../../shared/ui/difficulty-pill/difficulty-pill.component';
import { TagChipComponent } from '../../shared/ui/tag-chip/tag-chip.component';

interface ListProblem {
  title: string;
  difficulty: string;
  tags: string[];
}

@Component({
  selector: 'app-list-detail-page',
  standalone: true,
  imports: [MatTableModule, NgFor, DifficultyPillComponent, TagChipComponent],
  templateUrl: './list-detail.page.html',
  styleUrls: ['./list-detail.page.scss']
})
export class ListDetailPage {
  displayedColumns = ['title', 'tags', 'difficulty'];
  data: ListProblem[] = [
    { title: 'Two Sum', difficulty: 'Easy', tags: ['array'] }
  ];
}
