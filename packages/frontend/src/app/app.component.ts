import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule],
  template: `
  <mat-sidenav-container class="app-container">
    <mat-sidenav #sidenav mode="side" opened>
      <mat-toolbar color="primary">Menu</mat-toolbar>
      <mat-nav-list>
        <a mat-list-item routerLink="/">Dashboard</a>
        <a mat-list-item routerLink="/reviews">Reviews</a>
        <a mat-list-item routerLink="/problems">Problems</a>
        <a mat-list-item routerLink="/lists">Lists</a>
        <a mat-list-item routerLink="/sync">Sync</a>
      </mat-nav-list>
    </mat-sidenav>
    <mat-sidenav-content>
      <mat-toolbar color="primary">
        <button mat-icon-button (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span>LeetCode Tracker</span>
      </mat-toolbar>
      <div class="content">
        <router-outlet></router-outlet>
      </div>
    </mat-sidenav-content>
  </mat-sidenav-container>
  `,
  styles: [`
    .app-container { height: 100vh; }
    .content { padding: 1rem; }
  `]
})
export class AppComponent {}
