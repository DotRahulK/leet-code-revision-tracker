import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
type CssClass = 'easy' | 'medium' | 'hard' | 'unknown';

@Component({
  selector: 'app-difficulty-pill',
  standalone: true,
  imports: [MatChipsModule, NgClass],
  templateUrl: './difficulty-pill.component.html',
  styleUrls: ['./difficulty-pill.component.scss'],
})
export class DifficultyPillComponent {
  /** Accepts 'Easy' | 'Medium' | 'Hard' (any casing). Falls back to 'Unknown'. */
  @Input() set difficulty(value: string | DifficultyLevel) {
    const v = (value ?? '').toString().trim().toLowerCase();
    if (v === 'easy')       { this.cssClass = 'easy';   this.label = 'Easy'; }
    else if (v === 'medium'){ this.cssClass = 'medium'; this.label = 'Medium'; }
    else if (v === 'hard')  { this.cssClass = 'hard';   this.label = 'Hard'; }
    else { this.cssClass = 'unknown'; this.label = (value as any) || 'Unknown'; }
  }

  label = 'Easy';
  cssClass: CssClass = 'easy';
}
