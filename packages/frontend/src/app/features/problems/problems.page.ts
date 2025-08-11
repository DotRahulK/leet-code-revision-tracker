import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgFor } from '@angular/common';
import { DifficultyPillComponent } from '../../shared/ui/difficulty-pill/difficulty-pill.component';
import { TagChipComponent } from '../../shared/ui/tag-chip/tag-chip.component';
import { UiProblem, Difficulty } from '../../core/models';
import { ProblemsFacade } from '../../core/problems.facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-problems-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgFor,
    AsyncPipe,
    DifficultyPillComponent,
    TagChipComponent
  ],
  templateUrl: './problems.page.html',
  styleUrls: ['./problems.page.scss']
})
export class ProblemsPage implements OnInit {
  displayedColumns = ['title', 'tags', 'difficulty'];
  problems$!: Observable<UiProblem[]>;
  difficulties = Object.values(Difficulty);

  constructor(private facade: ProblemsFacade) {}

  ngOnInit() {
    this.problems$ = this.facade.list();
  }
}
