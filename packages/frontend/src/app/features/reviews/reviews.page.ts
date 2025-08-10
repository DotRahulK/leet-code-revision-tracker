import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface UserProblem {
  id: string;
  problem: { title: string; difficulty: string; slug: string };
}

@Component({
  selector: 'app-reviews-page',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, NgFor, NgIf],
  template: `
    <div *ngIf="items.length === 0">No pending reviews</div>
    <table mat-table [dataSource]="items" *ngIf="items.length > 0">
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Problem</th>
        <td mat-cell *matCellDef="let el">
          {{ el.problem.title }} ({{ el.problem.difficulty }})
        </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Score</th>
        <td mat-cell *matCellDef="let el">
          <button mat-button *ngFor="let q of scores" (click)="rate(el.id, q)">
            {{ q }}
          </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
    <div class="mt-4">
      <p>Scoring guide:</p>
      <ul>
        <li *ngFor="let q of scores">{{ q }} - {{ scoreHelp[q] }}</li>
      </ul>
    </div>
  `,
})
export class ReviewsPage implements OnInit {
  items: UserProblem[] = [];
  displayedColumns = ['title', 'actions'];
  scores = [0, 1, 2, 3, 4, 5];
  scoreHelp: Record<number, string> = {
    0: 'Complete blackout',
    1: 'Incorrect solution',
    2: 'Partial recall',
    3: 'Solved with effort',
    4: 'Correct with hesitation',
    5: 'Perfect recall',
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.http
      .get<UserProblem[]>('/api/reviews/unscored')
      .subscribe((res) => (this.items = res));
  }

  rate(id: string, quality: number) {
    this.http.post(`/api/reviews/${id}`, { quality }).subscribe(() => {
      this.items = this.items.filter((i) => i.id !== id);
    });
  }
}
