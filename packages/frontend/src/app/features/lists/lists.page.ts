import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface ProblemList {
  id: string;
  name: string;
  scheduled: boolean;
}

@Component({
  selector: 'app-lists-page',
  standalone: true,
  imports: [MatListModule, MatButtonModule, NgFor],
  template: `
    <mat-list>
      <mat-list-item *ngFor="let list of lists">
        {{ list.name }}
        <button mat-button (click)="schedule(list.id)">
          {{ list.scheduled ? 'Scheduled' : 'Schedule' }}
        </button>
      </mat-list-item>
    </mat-list>
  `
})
export class ListsPage implements OnInit {
  lists: ProblemList[] = [];
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.load();
  }
  load() {
    this.http.get<ProblemList[]>('/api/lists').subscribe((res) => (this.lists = res));
  }
  schedule(id: string) {
    this.http.post(`/api/lists/${id}/schedule`, {}).subscribe(() => this.load());
  }
}
