import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SyncFacade } from '../../core/sync.facade';
import { SyncResult } from '../../core/models';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sync-page',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, NgIf, AsyncPipe],
  templateUrl: './sync.page.html',
  styleUrls: ['./sync.page.scss']
})
export class SyncPage {
  result$?: Observable<SyncResult>;

  constructor(private facade: SyncFacade) {}

  sync() {
    this.result$ = this.facade.syncRecent();
  }
}
