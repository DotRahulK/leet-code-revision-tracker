import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgFor } from '@angular/common';
import { ReviewsFacade } from '../../core/reviews.facade';
import { ListsFacade } from '../../core/lists.facade';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [MatCardModule, NgFor],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  stats = [
    { label: 'Solved', value: 0 },
    { label: 'Due Today', value: 0 },
    { label: 'Overdue', value: 0 },
    { label: 'Lists', value: 0 }
  ];

  constructor(private reviews: ReviewsFacade, private lists: ListsFacade) {}

  ngOnInit() {
    this.reviews.getDueReviews().subscribe(res => {
      this.stats[1].value = res.length;
      this.stats[2].value = res.filter(r => r.overdue).length;
    });
    this.lists.getLists().subscribe(res => (this.stats[3].value = res.length));
  }
}
