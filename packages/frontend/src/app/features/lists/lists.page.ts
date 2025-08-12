import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

  import { ListsFacade } from '../../core/lists.facade';
import { UiList } from '../../core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lists-page',
  standalone: true,
  imports: [
    // UI
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule,

    // Angular
    RouterLink,
    NgFor,
    NgIf,
    AsyncPipe,
    FormsModule,
  ],
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit {
  lists$!: Observable<UiList[]>;
  importUrl = '';
  newListName = '';
  isBusy = false;

  /** Accept http(s)://… OR a slug like "folder/name" or "my-list" */
  readonly importPattern = '^(https?://\\S+|[A-Za-z0-9](?:[A-Za-z0-9\\-/]*))$';

  @ViewChild('importDialog') importDialog!: TemplateRef<any>;
  @ViewChild('newListDialog') newListDialog!: TemplateRef<any>;

  private dialog = inject(MatDialog);
  private facade = inject(ListsFacade);
  private snack = inject(MatSnackBar);

  ngOnInit() {
    this.load();
  }

  load() {
    this.lists$ = this.facade.getLists();
  }

  openImportDialog() {
    this.importUrl = '';
    this.dialog.open(this.importDialog, { width: '480px' })
      .afterClosed()
      .subscribe((url: string | null | undefined) => {
        if (url && this.isValidImport(url)) {
          this.doImport(url);
        }
      });
  }

  openNewListDialog() {
    this.newListName = '';
    this.dialog
      .open(this.newListDialog, { width: '360px' })
      .afterClosed()
      .subscribe((name: string | null | undefined) => {
        if (name) {
          this.facade.createList(name).subscribe(() => this.load());
        }
      });
  }

  confirmImport() {
    // handled by [mat-dialog-close]; keep for Enter key fallback if needed
  }

  isValidImport(val: string | null | undefined): boolean {
    if (!val) return false;
    const re = new RegExp(this.importPattern);
    return re.test(val.trim());
  }

  private doImport(url: string) {
    this.isBusy = true;
    this.snack.open('Importing list…', undefined, { duration: 1500 });

    this.facade.importList(url).subscribe({
      next: () => {
        this.isBusy = false;
        this.snack.open('List imported', 'Dismiss', { duration: 2500 });
        this.load();
      },
      error: (err) => {
        this.isBusy = false;
        console.error(err);
        this.snack.open('Import failed. Check URL/slug and try again.', 'Dismiss', { duration: 3500 });
      },
    });
  }

  trackById = (_: number, list: UiList) => (list as any).id ?? (list as any).slug ?? list.name;
}
