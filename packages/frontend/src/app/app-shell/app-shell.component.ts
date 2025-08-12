import { Component, ViewChild } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay, filter, withLatestFrom } from 'rxjs';
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

  readonly isHandset$ = this.breakpoint
    .observe('(max-width: 768px)')
    .pipe(map(result => result.matches), shareReplay());

  constructor(
    private breakpoint: BreakpointObserver,
    private router: Router
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        withLatestFrom(this.isHandset$),
        filter(([_, handset]) => handset),
        takeUntilDestroyed()
      )
      .subscribe(() => this.drawer.close());
  }
}
