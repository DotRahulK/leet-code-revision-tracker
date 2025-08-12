import { Component, OnInit, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe, NgFor } from '@angular/common';
import { ScheduledFacade } from '../../core/scheduled.facade';
import { UiScheduledItem } from '../../core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-scheduled-page',
  standalone: true,
  imports: [MatListModule, AsyncPipe, NgFor],
  templateUrl: './scheduled.page.html',
  styleUrls: ['./scheduled.page.scss'],
})
export class ScheduledPage implements OnInit {
  items$!: Observable<UiScheduledItem[]>;
  private facade = inject(ScheduledFacade);

  ngOnInit() {
    this.items$ = this.facade.getScheduled();
  }

  trackById = (_: number, item: UiScheduledItem) => item.id;
}
