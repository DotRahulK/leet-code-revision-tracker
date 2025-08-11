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

  constructor(
    private ref: MatDialogRef<RateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {}

  choose(q: number) {
    this.ref.close(q);
  }
}
