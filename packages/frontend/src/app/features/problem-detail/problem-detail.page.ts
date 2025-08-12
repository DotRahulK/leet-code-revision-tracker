import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ correct source
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { DifficultyPillComponent } from '../../shared/ui/difficulty-pill/difficulty-pill.component';
import { TagChipComponent } from '../../shared/ui/tag-chip/tag-chip.component';
import { ProblemsFacade } from '../../core/problems.facade';
import { ReviewsFacade } from '../../core/reviews.facade';
import { UiProblem } from '../../core/models';
import { Observable, map, switchMap, filter, of } from 'rxjs';
import { RateDialogComponent } from '../../shared/ui/rate-dialog/rate-dialog.component';
import { ScheduledFacade } from '../../core/scheduled.facade';

@Component({
  selector: 'app-problem-detail-page',
  standalone: true,
  imports: [
    // Angular
    NgIf, NgFor, AsyncPipe, FormsModule,

    // Material
    MatCardModule, MatTabsModule, MatInputModule, TextFieldModule,
    MatButtonModule, MatDialogModule, MatSnackBarModule,

    // Custom
    DifficultyPillComponent, TagChipComponent,
  ],
  templateUrl: './problem-detail.page.html',
  styleUrls: ['./problem-detail.page.scss']
})
export class ProblemDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private problems = inject(ProblemsFacade);
  private reviews = inject(ReviewsFacade);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  private scheduled = inject(ScheduledFacade);

  problem$!: Observable<UiProblem>;

  // notes + UX state
  notes = '';
  private originalNotes = signal<string>(''); // if you later load existing notes, set this
  saving = false;
  notesChanged = computed(() => this.notes !== this.originalNotes());

  ngOnInit() {
    // Load the problem reactively so it updates if slug changes
    this.problem$ = this.route.paramMap.pipe(
      map(params => params.get('slug')!),
      switchMap(slug => this.problems.getBySlug(slug))
    );

    // Optional: if you have an API to get existing notes, set both notes + originalNotes here.
    // this.problem$.pipe(
    //   switchMap(p => this.reviews.getNotes(p.id))
    // ).subscribe(n => {
    //   this.notes = n ?? '';
    //   this.originalNotes.set(this.notes);
    // });
  }

  saveNotes(problemId: string) {
    this.saving = true;
    this.reviews.updateNotes(problemId, this.notes).subscribe({
      next: () => {
        this.originalNotes.set(this.notes);
        this.snack.open('Notes saved', undefined, { duration: 1800 });
        this.saving = false;
      },
      error: () => {
        this.snack.open('Failed to save notes', 'Dismiss', { duration: 2500 });
        this.saving = false;
      }
    });
  }

  /** Open dialog first; only link + rate if user actually chose a quality */
  rate(problem: UiProblem) {
    this.dialog.open(RateDialogComponent, { data: { title: problem.title } })
      .afterClosed()
      .pipe(
        filter(q => q != null),
        switchMap(quality =>
          this.reviews.linkProblem(problem.id).pipe(
            switchMap(userProblemId => this.reviews.rateRecall(userProblemId, quality))
          )
        )
      )
      .subscribe({
        next: () => this.snack.open('Recall rated', undefined, { duration: 1500 }),
        error: () => this.snack.open('Failed to submit rating', 'Dismiss', { duration: 2500 })
      });
  }

  schedule(problem: UiProblem) {
    this.scheduled.scheduleProblem(problem.id).subscribe({
      next: () => this.snack.open('Scheduled', undefined, { duration: 1500 }),
      error: () => this.snack.open('Failed to schedule', 'Dismiss', { duration: 2500 }),
    });
  }
}
