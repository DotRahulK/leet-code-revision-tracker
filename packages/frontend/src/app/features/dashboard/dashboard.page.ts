import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [MatCardModule, NgFor],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage {
  stats = [
    { label: 'Solved', value: 0 },
    { label: 'Due Today', value: 0 },
    { label: 'Overdue', value: 0 },
    { label: 'Lists', value: 0 }
  ];
}
