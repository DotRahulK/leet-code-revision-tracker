import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sync-page',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './sync.page.html',
  styleUrls: ['./sync.page.scss']
})
export class SyncPage {
  sync() {
    // placeholder for sync logic
  }
}
