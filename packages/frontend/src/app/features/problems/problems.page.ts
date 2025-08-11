import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgFor } from '@angular/common';
import { DifficultyPillComponent } from '../../shared/ui/difficulty-pill/difficulty-pill.component';
import { TagChipComponent } from '../../shared/ui/tag-chip/tag-chip.component';

interface ProblemRow {
  title: string;
  difficulty: string;
  tags: string[];
}

@Component({
  selector: 'app-problems-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgFor,
    DifficultyPillComponent,
    TagChipComponent
  ],
  templateUrl: './problems.page.html',
  styleUrls: ['./problems.page.scss']
})
export class ProblemsPage {
  displayedColumns = ['title', 'tags', 'difficulty'];
  data: ProblemRow[] = [
    { title: 'Two Sum', difficulty: 'Easy', tags: ['array'] },
    { title: 'Word Ladder', difficulty: 'Hard', tags: ['graph'] }
  ];
  difficulties = ['Easy', 'Medium', 'Hard'];
}
