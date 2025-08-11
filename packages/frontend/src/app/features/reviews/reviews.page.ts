import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AsyncPipe, NgFor } from '@angular/common';
import { DifficultyPillComponent } from '../../shared/ui/difficulty-pill/difficulty-pill.component';
import { TagChipComponent } from '../../shared/ui/tag-chip/tag-chip.component';
import { ReviewsFacade } from '../../core/reviews.facade';
import { UiReview } from '../../core/models';
import { Observable } from 'rxjs';
import { RateDialogComponent } from '../../shared/ui/rate-dialog/rate-dialog.component';

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
  unscored$!: Observable<UiReview[]>;

  constructor(private dialog: MatDialog, private facade: ReviewsFacade) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.reviews$ = this.facade.getDueReviews();
    this.unscored$ = this.facade.getUnscored();
  }

  rate(row: UiReview) {
    const ref = this.dialog.open(RateDialogComponent, {
      data: { title: row.problem.title }
    });
    ref.afterClosed().subscribe(quality => {
      if (quality != null) {
        this.facade.rateRecall(row.id, quality).subscribe(() => this.load());
      }
    });
  }
}
