import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DifficultyPillComponent } from '../../shared/ui/difficulty-pill/difficulty-pill.component';
import { TagChipComponent } from '../../shared/ui/tag-chip/tag-chip.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-problem-detail-page',
  standalone: true,
  imports: [MatCardModule, MatTabsModule, MatInputModule, FormsModule, DifficultyPillComponent, TagChipComponent, NgFor],
  templateUrl: './problem-detail.page.html',
  styleUrls: ['./problem-detail.page.scss']
})
export class ProblemDetailPage {
  title = 'Two Sum';
  difficulty = 'Easy';
  tags = ['array'];
  description = 'Add two numbers';
  code = 'function twoSum() { }';
  notes = '';
}
