import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { NgFor } from '@angular/common';
import { DifficultyPillComponent } from '../../shared/ui/difficulty-pill/difficulty-pill.component';
import { TagChipComponent } from '../../shared/ui/tag-chip/tag-chip.component';
import { ConfirmDialogComponent } from '../../shared/ui/confirm-dialog/confirm-dialog.component';

interface ReviewRow {
  title: string;
  tags: string[];
  difficulty: string;
  due: string;
}

@Component({
  selector: 'app-reviews-page',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, NgFor, DifficultyPillComponent, TagChipComponent],
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss']
})
export class ReviewsPage {
  displayedColumns = ['title', 'tags', 'difficulty', 'due', 'actions'];
  data: ReviewRow[] = [
    { title: 'Two Sum', tags: ['array'], difficulty: 'Easy', due: '2024-01-01' },
    { title: 'Binary Tree Paths', tags: ['tree'], difficulty: 'Medium', due: '2024-01-02' }
  ];

  constructor(private dialog: MatDialog) {}

  rate(row: ReviewRow) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Rate Recall', message: `Mark ${row.title} as reviewed?` }
    });
  }
}
