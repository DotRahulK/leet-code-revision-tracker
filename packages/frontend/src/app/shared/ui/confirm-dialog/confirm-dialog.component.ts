import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  /** Button texts (optional) */
  confirmText?: string;
  cancelText?: string;
  /** Color / intent */
  type?: 'warn' | 'primary';
  color?: 'primary' | 'accent' | 'warn';
  /** Optional icon name (e.g., 'warning', 'info', 'delete') */
  icon?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent, boolean>);
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  cancel()  { this.dialogRef.close(false); }
  confirm() { this.dialogRef.close(true); }
}
