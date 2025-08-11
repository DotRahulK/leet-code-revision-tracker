import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ListsFacade } from '../../core/lists.facade';
import { UiList } from '../../core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lists-page',
  standalone: true,
  imports: [
    MatListModule,
    MatButtonModule,
    NgFor,
    AsyncPipe,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.scss']
})
export class ListsPage implements OnInit {
  lists$!: Observable<UiList[]>;
  importUrl = '';
  @ViewChild('importDialog') importDialog!: TemplateRef<any>;

  constructor(private dialog: MatDialog, private facade: ListsFacade) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.lists$ = this.facade.getLists();
  }

  import() {
    this.importUrl = '';
    const ref = this.dialog.open(this.importDialog);
    ref.afterClosed().subscribe((url: string) => {
      if (url) {
        this.facade.importList(url).subscribe(() => this.load());
      }
    });
  }
}
