import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from './theme.service';

type Theme = 'white' | 'high-contrast-dark' | 'eink' | 'eink-dark';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <!-- Toolbar button that shows current theme; opens menu -->
    <button
      mat-icon-button
      [matMenuTriggerFor]="themeMenu"
      [attr.aria-label]="'Change theme (current: ' + labelFor(current) + ')'"
      matTooltip="Theme"
      class="theme-btn"
    >
      <mat-icon aria-hidden="true">{{ iconFor(current) }}</mat-icon>
    </button>

    <mat-menu #themeMenu="matMenu">
      <button
        mat-menu-item
        role="menuitemradio"
        [attr.aria-checked]="current==='white'"
        (click)="set('white')"
      >
        <mat-icon aria-hidden="true">light_mode</mat-icon>
        <span>Light</span>
        <span class="spacer"></span>
        <mat-icon *ngIf="current==='white'" aria-hidden="true">check</mat-icon>
      </button>

      <button
        mat-menu-item
        role="menuitemradio"
        [attr.aria-checked]="current==='high-contrast-dark'"
        (click)="set('high-contrast-dark')"
      >
        <mat-icon aria-hidden="true">brightness_4</mat-icon>
        <span>High Contrast</span>
        <span class="spacer"></span>
        <mat-icon *ngIf="current==='high-contrast-dark'" aria-hidden="true">check</mat-icon>
      </button>

      <button
        mat-menu-item
        role="menuitemradio"
        [attr.aria-checked]="current==='eink'"
        (click)="set('eink')"
      >
        <mat-icon aria-hidden="true">menu_book</mat-icon>
        <span>E-Ink (B/W)</span>
        <span class="spacer"></span>
        <mat-icon *ngIf="current==='eink'" aria-hidden="true">check</mat-icon>
      </button>

      <button
        mat-menu-item
        role="menuitemradio"
        [attr.aria-checked]="current==='eink-dark'"
        (click)="set('eink-dark')"
      >
        <mat-icon aria-hidden="true">menu_book</mat-icon>
        <span>E-Ink Dark (B/W)</span>
        <span class="spacer"></span>
        <mat-icon *ngIf="current==='eink-dark'" aria-hidden="true">check</mat-icon>
      </button>
    </mat-menu>
  `,
  styles: [`
    :host { display: inline-flex; }
    .theme-btn { margin-left: auto; }
    .spacer { flex: 1 1 auto; }
  `]
})
export class ThemeToggleComponent {
  constructor(public theme: ThemeService) {}

  get current(): Theme {
    return this.theme.getTheme() as Theme;
  }

  set(t: Theme) {
    this.theme.setTheme(t);
  }

  iconFor(t: Theme) {
    switch (t) {
      case 'white': return 'light_mode';
      case 'eink':
      case 'eink-dark': return 'menu_book';
      default: return 'brightness_4';
    }
  }

  labelFor(t: Theme) {
    switch (t) {
      case 'white': return 'Light';
      case 'eink': return 'E-Ink (B/W)';
      case 'eink-dark': return 'E-Ink Dark (B/W)';
      default: return 'High Contrast';
    }
  }
}
