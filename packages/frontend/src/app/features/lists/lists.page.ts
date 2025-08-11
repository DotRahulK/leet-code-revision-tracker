import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/ui/confirm-dialog/confirm-dialog.component';
import { ListsFacade } from '../../core/lists.facade';
import { UiList } from '../../core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lists-page',
  standalone: true,
  imports: [MatListModule, MatButtonModule, NgFor, AsyncPipe],
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.scss']
})
export class ListsPage implements OnInit {
  lists$!: Observable<UiList[]>;

  constructor(private dialog: MatDialog, private facade: ListsFacade) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.lists$ = this.facade.getLists();
  }

  import() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Import List', message: 'Enter list URL or slug:' }
    });
    ref.afterClosed().subscribe((url: string) => {
      if (url) {
        this.facade.importList(url).subscribe(() => this.load());
      }
    });
  }
}
