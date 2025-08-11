import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DifficultyPillComponent } from '../../shared/ui/difficulty-pill/difficulty-pill.component';
import { TagChipComponent } from '../../shared/ui/tag-chip/tag-chip.component';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UiProblem } from '../../core/models';
import { ProblemsFacade } from '../../core/problems.facade';
import { ReviewsFacade } from '../../core/reviews.facade';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RateDialogComponent } from '../../shared/ui/rate-dialog/rate-dialog.component';

@Component({
  selector: 'app-problem-detail-page',
  standalone: true,
  imports: [MatCardModule, MatTabsModule, MatInputModule, FormsModule, MatButtonModule, DifficultyPillComponent, TagChipComponent, NgFor, NgIf, AsyncPipe],
  templateUrl: './problem-detail.page.html',
  styleUrls: ['./problem-detail.page.scss']
})
export class ProblemDetailPage implements OnInit {
  problem$!: Observable<UiProblem>;
  notes = '';

  constructor(
    private route: ActivatedRoute,
    private problems: ProblemsFacade,
    private reviews: ReviewsFacade,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.problem$ = this.problems.getBySlug(slug);
  }

  saveNotes(problemId: string) {
    this.reviews.updateNotes(problemId, this.notes).subscribe();
  }

  rate(problem: UiProblem) {
    this.reviews.linkProblem(problem.id).subscribe(userProblemId => {
      const ref = this.dialog.open(RateDialogComponent, { data: { title: problem.title } });
      ref.afterClosed().subscribe(quality => {
        if (quality != null) {
          this.reviews.rateRecall(userProblemId, quality).subscribe();
        }
      });
    });
  }
}
