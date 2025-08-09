import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-reviews-page',
  standalone: true,
  imports: [MatTableModule],
  template: `<table mat-table [dataSource]="[]"></table>`
})
export class ReviewsPage {}
