import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TedarikService, Tedarik } from '../../services/tedarik.service';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-urun-tedarik-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card class="main-card">
        <mat-card-header>
          <mat-card-title>{{ urun?.urunAdi }} - Tedarik Geçmişi</mat-card-title>
          <mat-card-subtitle>Ürün Kodu: {{ urun?.urunID }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="product-info" *ngIf="urun">
            <p><strong>Stok Miktarı:</strong> {{ urun.stokMiktari }}</p>
            <p><strong>Birim Fiyat:</strong> {{ urun.fiyat | currency:'TRY':'symbol-narrow':'1.2-2' }}</p>
          </div>

          <div class="actions">
            <button mat-raised-button [routerLink]="['/tedarik/ekle']" [queryParams]="{urunId: urunId}">
              <mat-icon>add</mat-icon>
              Yeni Tedarik Ekle
            </button>
            <button mat-raised-button [routerLink]="['/tedarik']">
              <mat-icon>arrow_back</mat-icon>
              Geri Dön
            </button>
          </div>

          <table mat-table [dataSource]="tedarikler" class="tedarik-table" *ngIf="tedarikler.length > 0">
            <ng-container matColumnDef="tedarikID">
              <th mat-header-cell *matHeaderCellDef>Tedarik No</th>
              <td mat-cell *matCellDef="let tedarik">{{tedarik.tedarikID}}</td>
            </ng-container>

            <ng-container matColumnDef="tedarikciAdi">
              <th mat-header-cell *matHeaderCellDef>Tedarikçi</th>
              <td mat-cell *matCellDef="let tedarik">{{tedarik.tedarikciAdi}}</td>
            </ng-container>

            <ng-container matColumnDef="tedarikMiktari">
              <th mat-header-cell *matHeaderCellDef>Miktar</th>
              <td mat-cell *matCellDef="let tedarik">{{tedarik.tedarikMiktari}}</td>
            </ng-container>

            <ng-container matColumnDef="birimFiyat">
              <th mat-header-cell *matHeaderCellDef>Birim Fiyat</th>
              <td mat-cell *matCellDef="let tedarik">{{tedarik.birimFiyat | currency:'TRY':'symbol-narrow':'1.2-2'}}</td>
            </ng-container>

            <ng-container matColumnDef="tedarikTarihi">
              <th mat-header-cell *matHeaderCellDef>Tarih</th>
              <td mat-cell *matCellDef="let tedarik">{{tedarik.tedarikTarihi | date:'medium'}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>İşlemler</th>
              <td mat-cell *matCellDef="let tedarik">
                <button mat-raised-button [routerLink]="['/tedarik/detay', tedarik.tedarikID]">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-raised-button [routerLink]="['/tedarik/duzenle', tedarik.tedarikID]">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-raised-button (click)="deleteTedarik(tedarik.tedarikID)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <div class="no-data" *ngIf="tedarikler.length === 0">
            <p>Bu ürüne ait tedarik kaydı bulunmamaktadır.</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }

    .main-card {
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      
      mat-card-header {
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;

        mat-card-title {
          color: #000000;
          font-size: 1.5rem;
          margin: 0;
        }

        mat-card-subtitle {
          color: #000000;
          margin: 8px 0 0 0;
        }
      }
    }

    .product-info {
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
      background-color: #ffffff;

      p {
        color: #000000;
        margin: 8px 0;
        
        strong {
          color: #000000;
        }
      }
    }

    .actions {
      padding: 16px;
      display: flex;
      gap: 16px;
      background-color: #ffffff;

      button {
        background-color: #ffffff;
        color: #000000;
        border: 1px solid #000000;

        mat-icon {
          color: #000000;
        }
      }
    }

    .tedarik-table {
      width: 100%;
      background-color: #ffffff;
      margin-top: 16px;

      th {
        background-color: #ffffff;
        color: #000000;
        font-weight: 500;
        padding: 12px;
        border-bottom: 1px solid #e0e0e0;
      }

      td {
        background-color: #ffffff;
        color: #000000;
        padding: 12px;
        border-bottom: 1px solid #e0e0e0;

        button {
          background-color: #ffffff;
          color: #000000;
          border: 1px solid #000000;
          margin: 0 4px;

          mat-icon {
            color: #000000;
          }
        }
      }
    }

    .no-data {
      padding: 32px;
      text-align: center;
      background-color: #ffffff;
      
      p {
        color: #000000;
        font-size: 1.1rem;
        margin: 0;
      }
    }

    ::ng-deep {
      .mat-mdc-raised-button {
        background-color: #ffffff !important;
        color: #000000 !important;
        border: 1px solid #000000 !important;
        box-shadow: none !important;

        .mat-icon {
          color: #000000 !important;
        }
      }

      .mat-mdc-table {
        background-color: #ffffff !important;
      }

      .mat-mdc-row, .mat-mdc-header-row {
        background-color: #ffffff !important;
      }
    }
  `]
})
export class UrunTedarikListComponent implements OnInit {
  urunId!: number;
  urun?: Product;
  tedarikler: Tedarik[] = [];
  displayedColumns: string[] = ['tedarikID', 'tedarikciAdi', 'tedarikMiktari', 'birimFiyat', 'tedarikTarihi', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private tedarikService: TedarikService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.urunId = +id;
        this.loadUrun();
        this.loadTedarikler();
      }
    });
  }

  loadUrun(): void {
    this.productService.getProduct(this.urunId).subscribe({
      next: (data) => {
        this.urun = data;
      },
      error: (error) => {
        this.showError('Ürün bilgileri yüklenirken bir hata oluştu');
        console.error('Error loading product:', error);
      }
    });
  }

  loadTedarikler(): void {
    this.tedarikService.getTedariklerByUrun(this.urunId).subscribe({
      next: (data) => {
        this.tedarikler = data;
      },
      error: (error) => {
        this.showError('Tedarik listesi yüklenirken bir hata oluştu');
        console.error('Error loading tedarikler:', error);
      }
    });
  }

  deleteTedarik(id: number): void {
    if (confirm('Bu tedarik kaydını silmek istediğinizden emin misiniz?')) {
      this.tedarikService.deleteTedarik(id).subscribe({
        next: () => {
          this.showSuccess('Tedarik başarıyla silindi');
          this.loadTedarikler();
        },
        error: (error) => {
          this.showError('Tedarik silinirken bir hata oluştu');
          console.error('Error deleting tedarik:', error);
        }
      });
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Kapat', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
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