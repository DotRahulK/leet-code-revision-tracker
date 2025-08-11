import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [MatSlideToggleModule, MatIconModule],
  template: `
    <mat-slide-toggle
      [checked]="theme.isDark()"
      (change)="theme.toggle()"
      aria-label="Toggle theme"
      class="theme-toggle">
      <mat-icon>{{ theme.isDark() ? 'dark_mode' : 'light_mode' }}</mat-icon>
    </mat-slide-toggle>
  `,
  styles: [`.theme-toggle{margin-left:auto;}`]
})
export class ThemeToggleComponent {
  constructor(public theme: ThemeService) {}
}
