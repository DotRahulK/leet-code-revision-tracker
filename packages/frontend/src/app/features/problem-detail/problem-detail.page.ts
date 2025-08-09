import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-problem-detail-page',
  standalone: true,
  imports: [MatCardModule],
  template: `<mat-card>Problem Detail</mat-card>`
})
export class ProblemDetailPage {}
