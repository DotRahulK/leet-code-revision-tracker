import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-difficulty-pill',
  standalone: true,
  imports: [MatChipsModule],
  templateUrl: './difficulty-pill.component.html',
  styleUrls: ['./difficulty-pill.component.scss']
})
export class DifficultyPillComponent {
  @Input() difficulty: 'Easy' | 'Medium' | 'Hard' | string = 'Easy';
}
