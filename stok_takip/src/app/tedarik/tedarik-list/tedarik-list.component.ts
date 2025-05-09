import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService, Product } from '../../services/product.service';
import { TedarikService } from '../../services/tedarik.service';

@Component({
  selector: 'app-tedarik-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Ürün Listesi</h2>
      </div>

      <!-- Arama Bölümü -->
      <mat-card class="search-card mb-4">
        <mat-card-content>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Ürün Ara</mat-label>
            <input matInput 
                   [(ngModel)]="searchText" 
                   (keyup)="filterProducts()"
                   placeholder="Ürün adı ile arama yapın...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <!-- Yükleniyor Göstergesi -->
      <div *ngIf="loading" class="loading-spinner">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Ürünler yükleniyor...</p>
      </div>

      <!-- Hata Mesajı -->
      <mat-card *ngIf="error" class="error-card">
        <mat-card-content>
          <mat-icon color="warn">error</mat-icon>
          {{ error }}
        </mat-card-content>
      </mat-card>

      <!-- Ürün Grid'i -->
      <div class="product-grid" *ngIf="!loading && !error">
        <mat-grid-list cols="3" rowHeight="400px" gutterSize="16px">
          <mat-grid-tile *ngFor="let urun of filteredUrunler">
            <mat-card class="product-card">
              <img mat-card-image [src]="getProductImage(urun)" alt="{{urun.urunAdi}}" class="product-image">
              <mat-card-content>
                <h3>{{urun.urunAdi}}</h3>
                <p>Stok: {{urun.stokMiktari}}</p>
                <p>Fiyat: {{urun.fiyat | currency:'TRY':'symbol-narrow':'1.2-2'}}</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" [routerLink]="['/tedarik/urun', urun.urunID]">
                  <mat-icon>list</mat-icon>
                  Tedarik Geçmişi
                </button>
                <button mat-raised-button color="accent" [routerLink]="['/tedarik/ekle']" [queryParams]="{urunId: urun.urunID}">
                  <mat-icon>add</mat-icon>
                  Tedarik Ekle
                </button>
              </mat-card-actions>
            </mat-card>
          </mat-grid-tile>
        </mat-grid-list>

        <!-- Sonuç Bulunamadı Mesajı -->
        <div *ngIf="filteredUrunler.length === 0" class="no-results">
          <mat-icon>search_off</mat-icon>
          <p>Arama kriterine uygun ürün bulunamadı.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }

    h2 {
      color: #000000;
      font-weight: 500;
    }

    .search-card {
      background-color: #ffffff;
      margin-bottom: 20px;
      border: 1px solid #e0e0e0;

      mat-form-field {
        width: 100%;
        
        ::ng-deep {
          .mat-mdc-text-field-wrapper {
            background-color: #ffffff;
          }
          .mat-mdc-form-field-label {
            color: #000000;
          }
          .mat-mdc-input-element {
            color: #000000;
          }
          .mat-mdc-form-field-icon-suffix {
            color: #000000;
          }
        }
      }
    }

    .product-card {
      width: 100%;
      height: 100%;
      margin: 8px;
      display: flex;
      flex-direction: column;
      background-color: #ffffff !important;
      border: 1px solid #e0e0e0;

      mat-card-content {
        flex-grow: 1;
        padding: 16px;

        h3 {
          margin: 0 0 8px 0;
          font-size: 1.2rem;
          color: #000000;
        }

        p {
          margin: 4px 0;
          color: #000000;
        }
      }

      mat-card-actions {
        display: flex;
        gap: 8px;
        padding: 16px;
        justify-content: space-between;

        button {
          background-color: #ffffff;
          color: #000000;
          border: 1px solid #000000;

          mat-icon {
            color: #000000;
          }
        }
      }
    }

    .product-image {
      height: 200px;
      object-fit: cover;
    }

    ::ng-deep {
      .mat-mdc-card {
        background-color: #ffffff !important;
      }

      .mat-mdc-raised-button {
        background-color: #ffffff !important;
        color: #000000 !important;
        border: 1px solid #000000 !important;
        box-shadow: none !important;

        .mat-icon {
          color: #000000 !important;
        }
      }
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background-color: #ffffff;
      
      p {
        margin-top: 1rem;
        color: #000000;
      }
    }

    .error-card {
      margin: 1rem 0;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;

      mat-card-content {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #000000;
      }
    }

    .no-results {
      text-align: center;
      padding: 2rem;
      color: #000000;
      background-color: #ffffff;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 1rem;
        color: #000000;
      }

      p {
        font-size: 1.1rem;
        margin: 0;
        color: #000000;
      }
    }
  `]
})
export class TedarikListComponent implements OnInit {
  urunler: Product[] = [];
  filteredUrunler: Product[] = [];
  searchText: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUrunler();
  }

  loadUrunler(): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.urunler = data;
        this.filteredUrunler = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Ürünler yüklenirken bir hata oluştu';
        this.loading = false;
        console.error('Error loading products:', error);
      }
    });
  }

  filterProducts(): void {
    if (!this.searchText.trim()) {
      this.filteredUrunler = this.urunler;
    } else {
      const searchTerm = this.searchText.toLowerCase().trim();
      this.filteredUrunler = this.urunler.filter(urun => 
        urun.urunAdi.toLowerCase().includes(searchTerm)
      );
    }
  }

  getProductImage(urun: Product): string {
    return this.productService.getProductImageUrl(urun.urunGorseli);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Kapat', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
