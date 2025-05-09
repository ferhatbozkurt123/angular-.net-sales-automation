import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CariListComponent } from './cari-list/cari-list.component';

@Component({
  selector: 'app-cariler',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CariListComponent
  ],
  template: `
    <app-cari-list></app-cari-list>
  `
})
export class CarilerComponent {}
