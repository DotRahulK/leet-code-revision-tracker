import { Component, HostListener, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgFor } from '@angular/common';

type BtnColor = 'primary' | 'accent' | 'warn';

@Component({
  selector: 'app-rate-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule, NgFor],
  templateUrl: './rate-dialog.component.html',
  styleUrls: ['./rate-dialog.component.scss'],
})
export class RateDialogComponent {
  private ref = inject(MatDialogRef<RateDialogComponent, number | null>);
  readonly data = inject<{ title: string }>(MAT_DIALOG_DATA);

  // SM-2 style meanings with sensible colors
  defs = [
    { value: 0, label: 'Blackout',   help: 'Complete failure to recall',          color: 'warn'   as BtnColor, icon: 'block' },
    { value: 1, label: 'Incorrect',  help: 'Incorrect or major gaps',             color: 'warn'   as BtnColor, icon: 'close' },
    { value: 2, label: 'Hard',       help: 'Barely recalled; heavy effort',       color: 'warn'   as BtnColor, icon: 'priority_high' },
    { value: 3, label: 'Okay',       help: 'Hesitant, partially correct',         color: 'accent' as BtnColor, icon: 'check_circle_outline' },
    { value: 4, label: 'Good',       help: 'Correct with minor hesitation',       color: 'accent' as BtnColor, icon: 'check' },
    { value: 5, label: 'Easy',       help: 'Perfect, immediate recall',           color: 'primary'as BtnColor, icon: 'task_alt' },
  ];

  choose(q: number) { this.ref.close(q); }
  cancel() { this.ref.close(null); }

  // Keyboard shortcuts: 0–5 choose; Esc cancels
  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (e.key >= '0' && e.key <= '5') { this.choose(Number(e.key)); }
    else if (e.key === 'Escape') { this.cancel(); }
  }
}
