import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AsyncPipe, NgFor } from '@angular/common';
import { DifficultyPillComponent } from '../../shared/ui/difficulty-pill/difficulty-pill.component';
import { TagChipComponent } from '../../shared/ui/tag-chip/tag-chip.component';
import { ConfirmDialogComponent } from '../../shared/ui/confirm-dialog/confirm-dialog.component';
import { ReviewsFacade } from '../../core/reviews.facade';
import { UiReview } from '../../core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reviews-page',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, NgFor, AsyncPipe, DifficultyPillComponent, TagChipComponent],
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss']
})
export class ReviewsPage implements OnInit {
  displayedColumns = ['title', 'tags', 'difficulty', 'due', 'actions'];
  reviews$!: Observable<UiReview[]>;

  constructor(private dialog: MatDialog, private facade: ReviewsFacade) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.reviews$ = this.facade.getDueReviews();
  }

  rate(row: UiReview) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Rate Recall', message: `Mark ${row.problem.title} as reviewed?` }
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) {
        this.facade.rateRecall(row.id, 5).subscribe(() => this.load());
      }
    });
  }
}
