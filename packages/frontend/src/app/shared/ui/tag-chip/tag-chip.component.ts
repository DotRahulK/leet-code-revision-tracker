import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-tag-chip',
  standalone: true,
  imports: [MatChipsModule],
  templateUrl: './tag-chip.component.html',
  styleUrls: ['./tag-chip.component.scss']
})
export class TagChipComponent {
  @Input() tag = '';
}
