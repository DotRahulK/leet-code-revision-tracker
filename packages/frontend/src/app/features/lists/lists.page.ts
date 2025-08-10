import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-lists-page',
  standalone: true,
  imports: [MatListModule],
  template: `<mat-list></mat-list>`
})
export class ListsPage {}
