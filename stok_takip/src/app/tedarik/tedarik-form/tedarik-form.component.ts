import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TedarikService, TedarikCreateDto } from '../../services/tedarik.service';
import { ProductService, Product } from '../../services/product.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-tedarik-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container mt-4">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Tedarik Düzenle' : 'Yeni Tedarik Ekle' }}</mat-card-title>
          <mat-card-subtitle *ngIf="selectedProduct">Ürün: {{ selectedProduct.urunAdi }}</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="tedarikForm" (ngSubmit)="onSubmit()" class="form-container">
            <mat-form-field appearance="outline" class="full-width" *ngIf="!preSelectedUrunId">
              <mat-label>Ürün</mat-label>
              <mat-select formControlName="urunID">
                <mat-option *ngFor="let urun of urunler" [value]="urun.urunID">
                  {{urun.urunAdi}}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="tedarikForm.get('urunID')?.hasError('required')">
                Ürün seçimi zorunludur
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tedarikçi Adı</mat-label>
              <input matInput formControlName="tedarikciAdi" placeholder="Tedarikçi adını girin">
              <mat-error *ngIf="tedarikForm.get('tedarikciAdi')?.hasError('required')">
                Tedarikçi adı zorunludur
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tedarik Miktarı</mat-label>
              <input matInput type="number" formControlName="tedarikMiktari" placeholder="Miktar girin">
              <mat-error *ngIf="tedarikForm.get('tedarikMiktari')?.hasError('required')">
                Miktar zorunludur
              </mat-error>
              <mat-error *ngIf="tedarikForm.get('tedarikMiktari')?.hasError('min')">
                Miktar 1'den küçük olamaz
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Birim Fiyat</mat-label>
              <input matInput type="number" formControlName="birimFiyat" placeholder="Birim fiyat girin">
              <mat-error *ngIf="tedarikForm.get('birimFiyat')?.hasError('required')">
                Birim fiyat zorunludur
              </mat-error>
              <mat-error *ngIf="tedarikForm.get('birimFiyat')?.hasError('min')">
                Birim fiyat 0'dan küçük olamaz
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tedarik Tarihi</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="tedarikTarihi">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Açıklama</mat-label>
              <textarea matInput formControlName="aciklama" rows="3" placeholder="Açıklama girin"></textarea>
            </mat-form-field>

            <div class="button-container">
              <button mat-raised-button color="primary" type="submit" [disabled]="!tedarikForm.valid">
                <mat-icon>save</mat-icon>
                {{ isEditMode ? 'Güncelle' : 'Kaydet' }}
              </button>
              <button mat-raised-button type="button" [routerLink]="['/tedarik']">
                <mat-icon>arrow_back</mat-icon>
                İptal
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }

    h2 {
      color: #000000;
      font-weight: 500;
      margin-bottom: 24px;
    }

    .form-card {
      background-color: #ffffff !important;
      border: 1px solid #e0e0e0;
      padding: 24px;

      mat-card-content {
        color: #000000;
      }
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;

      mat-form-field {
        flex: 1;
        
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

          .mat-mdc-select-value-text {
            color: #000000;
          }

          .mat-mdc-select-arrow {
            color: #000000;
          }

          .mat-mdc-form-field-icon-suffix {
            color: #000000;
          }
        }
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;

      button {
        background-color: #ffffff;
        color: #000000;
        border: 1px solid #000000;

        mat-icon {
          color: #000000;
        }

        &:disabled {
          background-color: #f5f5f5;
          color: #666666;
          border-color: #666666;
        }
      }
    }

    .product-info {
      background-color: #ffffff;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      margin-bottom: 24px;

      h3 {
        color: #000000;
        margin: 0 0 8px 0;
        font-size: 1.1rem;
      }

      p {
        color: #000000;
        margin: 4px 0;
      }
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

        &:disabled {
          background-color: #f5f5f5 !important;
          color: #666666 !important;
          border-color: #666666 !important;
        }
      }

      .mat-mdc-option {
        color: #000000 !important;
      }

      .mat-mdc-select-panel {
        background-color: #ffffff !important;
      }

      .mat-calendar {
        background-color: #ffffff !important;
      }

      .mat-calendar-body-cell-content {
        color: #000000 !important;
      }

      .mat-calendar-body-selected {
        background-color: #ffffff !important;
        color: #000000 !important;
        border: 1px solid #000000 !important;
      }
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 4px;
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
  `]
})
export class TedarikFormComponent implements OnInit {
  tedarikForm: FormGroup;
  isEditMode = false;
  tedarikId?: number;
  urunler: Product[] = [];
  preSelectedUrunId?: number;
  selectedProduct?: Product;

  constructor(
    private fb: FormBuilder,
    private tedarikService: TedarikService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.tedarikForm = this.fb.group({
      urunID: ['', Validators.required],
      tedarikciAdi: ['', Validators.required],
      tedarikMiktari: ['', [Validators.required, Validators.min(1)]],
      birimFiyat: ['', [Validators.required, Validators.min(0)]],
      tedarikTarihi: [new Date()],
      aciklama: ['']
    });
  }

  ngOnInit(): void {
    this.loadUrunler();
    
    // URL'den tedarik ID'si ve ürün ID'si parametrelerini al
    const id = this.route.snapshot.paramMap.get('id');
    const urunId = this.route.snapshot.queryParamMap.get('urunId');

    if (id) {
      this.isEditMode = true;
      this.tedarikId = +id;
      this.loadTedarik(this.tedarikId);
    } else if (urunId) {
      this.preSelectedUrunId = +urunId;
      this.loadSelectedProduct(this.preSelectedUrunId);
      this.tedarikForm.patchValue({ urunID: this.preSelectedUrunId });
    }
  }

  loadUrunler(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.urunler = products;
      },
      error: (error) => {
        this.showError('Ürünler yüklenirken bir hata oluştu');
        console.error('Error loading products:', error);
      }
    });
  }

  loadSelectedProduct(urunId: number): void {
    this.productService.getProduct(urunId).subscribe({
      next: (product) => {
        this.selectedProduct = product;
      },
      error: (error) => {
        this.showError('Ürün bilgisi yüklenirken bir hata oluştu');
        console.error('Error loading product:', error);
      }
    });
  }

  loadTedarik(id: number): void {
    this.tedarikService.getTedarik(id).subscribe({
      next: (tedarik) => {
        this.loadSelectedProduct(tedarik.urunID);
        this.tedarikForm.patchValue({
          urunID: tedarik.urunID,
          tedarikciAdi: tedarik.tedarikciAdi,
          tedarikMiktari: tedarik.tedarikMiktari,
          birimFiyat: tedarik.birimFiyat,
          tedarikTarihi: new Date(tedarik.tedarikTarihi),
          aciklama: tedarik.aciklama
        });
      },
      error: (error) => {
        this.showError('Tedarik bilgileri yüklenirken bir hata oluştu');
        console.error('Error loading tedarik:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.tedarikForm.valid) {
      const tedarikData: TedarikCreateDto = this.tedarikForm.value;

      if (this.isEditMode && this.tedarikId) {
        this.tedarikService.updateTedarik(this.tedarikId, tedarikData).subscribe({
          next: () => {
            this.showSuccess('Tedarik başarıyla güncellendi');
            this.navigateBack();
          },
          error: (error) => {
            this.showError('Tedarik güncellenirken bir hata oluştu');
            console.error('Error updating tedarik:', error);
          }
        });
      } else {
        this.tedarikService.createTedarik(tedarikData).subscribe({
          next: () => {
            this.showSuccess('Tedarik başarıyla eklendi');
            this.navigateBack();
          },
          error: (error) => {
            this.showError('Tedarik eklenirken bir hata oluştu');
            console.error('Error creating tedarik:', error);
          }
        });
      }
    }
  }

  private navigateBack(): void {
    if (this.preSelectedUrunId) {
      this.router.navigate(['/tedarik/urun', this.preSelectedUrunId]);
    } else {
      this.router.navigate(['/tedarik']);
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
