import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { NgFor } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/ui/confirm-dialog/confirm-dialog.component';

interface ListItem {
  id: string;
  name: string;
}

@Component({
  selector: 'app-lists-page',
  standalone: true,
  imports: [MatListModule, MatButtonModule, NgFor],
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.scss']
})
export class ListsPage {
  lists: ListItem[] = [
    { id: '1', name: 'Top 100' },
    { id: '2', name: 'Blind 75' }
  ];

  constructor(private dialog: MatDialog) {}

  import() {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Import List', message: 'Import not implemented.' }
    });
  }
}
