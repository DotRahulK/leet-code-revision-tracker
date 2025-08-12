import {
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeToggleComponent } from '../../core/theme-toggle.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatTooltipModule, ThemeToggleComponent],
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.scss'],
})
export class AppToolbarComponent {
  @Input() title = '';
  @Output() menu = new EventEmitter<void>();

  // Elevation that increases when page is scrolled
  private scrolled = false;

  @HostBinding('class')
  get hostClasses() {
    return `mat-elevation-z${this.scrolled ? 4 : 0}`;
  }

  @HostListener('window:scroll')
  onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const newState = y > 2;
    if (newState !== this.scrolled) this.scrolled = newState;
  }
}
