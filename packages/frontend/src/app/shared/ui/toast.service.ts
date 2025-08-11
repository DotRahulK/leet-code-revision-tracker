import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snack: MatSnackBar) {}

  success(message: string) {
    this.snack.open(message, 'OK', { duration: 3000, panelClass: 'toast-success' });
  }

  error(message: string) {
    this.snack.open(message, 'OK', { duration: 3000, panelClass: 'toast-error' });
  }

  info(message: string) {
    this.snack.open(message, 'OK', { duration: 3000 });
  }
}
