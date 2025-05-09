// app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ProductFormComponent } from './product-form/product-form.component';
import { CategoryAddComponent } from './category-add/category-add.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container" *ngIf="!isLoginPage">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="menuOpen">
        <mat-toolbar>Menü</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item *ngFor="let item of menuItems" 
             [routerLink]="item.link" 
             (click)="item.action && item.action()">
            <mat-icon matListItemIcon>{{item.icon}}</mat-icon>
            <span matListItemTitle>{{item.text}}</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="toggleMenu()"
            class="menu-toggle-btn">
            <mat-icon>{{menuOpen ? 'menu_open' : 'menu'}}</mat-icon>
          </button>
          <span>Kale Stok Takip</span>
        </mat-toolbar>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>

    <router-outlet *ngIf="isLoginPage"></router-outlet>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'stok_takip';
  isHandset$: Observable<boolean>;
  menuOpen = false;

  menuItems = [
    { icon: 'inventory_2', text: 'Ana Sayfa', link: '/urunler' },
    { icon: 'shopping_cart', text: 'Satışlar', link: '/satislar' },
    { icon: 'people', text: 'Cari İşlemler', link: '/cariler' },
    { icon: 'local_shipping', text: 'Tedarik İşlemleri', link: '/tedarik' },
    { icon: 'assessment', text: 'Raporlar', link: '/report' },
    { icon: 'add', text: 'Ürün Ekle', action: () => this.addProduct() },
    { icon: 'category', text: 'Kategori Ekle', action: () => this.addcategory() },
    { icon: 'logout', text: 'Çıkış Yap', link: '/login' }

  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
    
    // URL'lerin görünmemesi için skipLocationChange'i true olarak ayarla
    this.router.navigate([this.router.url], { skipLocationChange: true });
  }

  get isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  addProduct(): void {
    this.dialog.open(ProductFormComponent, {
      width: '600px'
    });
  }
  
  addcategory(): void {
    this.dialog.open(CategoryAddComponent, {
      width: '600px'
    });
  }
}