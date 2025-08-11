import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-rate-dialog',
  standalone: true,
  imports: [MatButtonModule, NgFor],
  templateUrl: './rate-dialog.component.html',
  styleUrls: ['./rate-dialog.component.scss']
})
export class RateDialogComponent {
  qualities = [0, 1, 2, 3, 4, 5];
  data: { title: string };

  constructor(
    private ref: MatDialogRef<RateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { title: string }
  ) {
    this.data = data;
  }

  choose(q: number) {
    this.ref.close(q);
  }
}
