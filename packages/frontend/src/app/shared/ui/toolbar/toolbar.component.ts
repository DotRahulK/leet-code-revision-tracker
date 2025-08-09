import { Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule],
  template: `<mat-toolbar color="primary">{{title}}</mat-toolbar>`
})
export class ToolbarComponent {
  @Input() title = '';
}
