import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sync-page',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  template: `<mat-card><button mat-raised-button color="primary">Sync</button></mat-card>`
})
export class SyncPage {}
