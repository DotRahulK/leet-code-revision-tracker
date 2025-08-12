import { Component, ViewChild, inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay, filter, withLatestFrom, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppToolbarComponent } from '../shared/ui/app-toolbar.component';
import { AppSidenavComponent } from '../shared/ui/app-sidenav.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    MatSidenavModule,
    MatSnackBarModule,
    AppToolbarComponent,
    AppSidenavComponent
  ],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('200ms ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AppShellComponent {
  @ViewChild('drawer') drawer!: MatSidenav;

  private readonly breakpoint = inject(BreakpointObserver);
  private readonly router = inject(Router);

  readonly isHandset$ = this.breakpoint
    .observe('(max-width: 768px)')
    .pipe(
      map(result => result.matches),
      shareReplay({ bufferSize: 1, refCount: true })
    );

  constructor() {
    // Close drawer on navigation when in handset
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        withLatestFrom(this.isHandset$),
        filter(([_, handset]) => handset),
        takeUntilDestroyed()
      )
      .subscribe(() => this.drawer.close());
  }

  // Called when a nav item is clicked; one-shot read avoids DI context issues
  onNavItem() {
    this.isHandset$.pipe(take(1)).subscribe(isHandset => {
      if (isHandset) this.drawer.close();
    });
  }
}
