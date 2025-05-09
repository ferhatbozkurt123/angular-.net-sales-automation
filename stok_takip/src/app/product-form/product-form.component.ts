import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService, Product, CreateProductDto } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <h2>{{ isEditMode ? 'Ürün Düzenle' : 'Yeni Ürün Ekle' }}</h2>
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="fill">
        <mat-label>Ürün Adı</mat-label>
        <input matInput formControlName="urunAdi" required maxlength="200">
        <mat-error *ngIf="productForm.get('urunAdi')?.hasError('required')">
          Ürün adı zorunludur
        </mat-error>
        <mat-error *ngIf="productForm.get('urunAdi')?.hasError('maxlength')">
          Ürün adı en fazla 200 karakter olabilir
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Açıklama</mat-label>
        <textarea matInput formControlName="aciklama" rows="3"></textarea>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Fiyat (₺)</mat-label>
        <input matInput type="number" formControlName="fiyat" required min="0.01" step="0.01">
        <mat-error *ngIf="productForm.get('fiyat')?.hasError('required')">
          Fiyat zorunludur
        </mat-error>
        <mat-error *ngIf="productForm.get('fiyat')?.hasError('min')">
          Fiyat 0.01'den büyük olmalıdır
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Stok Miktarı</mat-label>
        <input matInput type="number" formControlName="stokMiktari" required min="0">
        <mat-error *ngIf="productForm.get('stokMiktari')?.hasError('required')">
          Stok miktarı zorunludur
        </mat-error>
        <mat-error *ngIf="productForm.get('stokMiktari')?.hasError('min')">
          Stok miktarı 0'dan büyük olmalıdır
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Kategori</mat-label>
        <mat-select formControlName="kategoriID">
          <mat-option [value]="null">Kategori Seçiniz</mat-option>
          <mat-option *ngFor="let category of categories" [value]="category.kategoriID">
            {{ category.kategoriAdi }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Özellikler</mat-label>
        <textarea matInput formControlName="ozellikler" rows="2"></textarea>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Görsel Linki (ImgBB)</mat-label>
        <input matInput formControlName="urunGorseli" placeholder="ImgBB görsel linkini yapıştırın">
        <mat-hint>ImgBB'den aldığınız doğrudan görsel linkini yapıştırın</mat-hint>
      </mat-form-field>

      <div class="preview" *ngIf="previewUrl">
        <img [src]="previewUrl" alt="Önizleme" (error)="handleImageError($event)">
        <button mat-icon-button color="warn" type="button" (click)="removeImage()">
          <mat-icon>delete</mat-icon>
        </button>
      </div>

      <div class="button-row">
        <button mat-raised-button color="primary" type="submit" [disabled]="!productForm.valid">
          {{ isEditMode ? 'Güncelle' : 'Ekle' }}
        </button>
        <button mat-button type="button" (click)="onCancel()">İptal</button>
      </div>
    </form>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
    }
    .button-row {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    .preview {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .preview img {
      max-width: 200px;
      max-height: 200px;
      object-fit: contain;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: any[] = [];
  isEditMode = false;
  previewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Product | null
  ) {
    this.isEditMode = !!data;
    this.productForm = this.fb.group({
      urunAdi: ['', [Validators.required, Validators.maxLength(200)]],
      aciklama: ['', [Validators.required]],
      fiyat: [0.01, [Validators.required, Validators.min(0.01)]],
      stokMiktari: [1, [Validators.required, Validators.min(0)]],
      kategoriID: [null],
      ozellikler: ['', [Validators.required]],
      urunGorseli: ['', [Validators.pattern('https?://.*')]]
    });

    if (this.isEditMode && data) {
      this.productForm.patchValue({
        urunAdi: data.urunAdi,
        aciklama: data.aciklama || '',
        fiyat: data.fiyat,
        stokMiktari: data.stokMiktari,
        kategoriID: data.kategoriID,
        ozellikler: data.ozellikler || '',
        urunGorseli: data.urunGorseli || ''
      });
      this.previewUrl = data.urunGorseli || null;
    }
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
        this.showError('Kategoriler yüklenemedi');
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData: CreateProductDto = {
        urunAdi: this.productForm.get('urunAdi')?.value?.trim() || '',
        aciklama: this.productForm.get('aciklama')?.value?.trim() || null,
        fiyat: Number(this.productForm.get('fiyat')?.value) || 0.01,
        stokMiktari: Number(this.productForm.get('stokMiktari')?.value) || 1,
        kategoriID: this.productForm.get('kategoriID')?.value || null,
        ozellikler: this.productForm.get('ozellikler')?.value?.trim() || null,
        urunGorseli: this.productForm.get('urunGorseli')?.value?.trim() || null
      };

      // Veri doğrulama kontrolleri
      if (formData.urunAdi.length === 0 || formData.urunAdi.length > 200) {
        this.showError('Ürün adı 1-200 karakter arasında olmalıdır');
        return;
      }

      if (formData.fiyat <= 0) {
        this.showError('Fiyat 0\'dan büyük olmalıdır');
        return;
      }

      if (formData.stokMiktari < 0) {
        this.showError('Stok miktarı 0 veya daha büyük olmalıdır');
        return;
      }

      if (this.isEditMode && this.data?.urunID) {
        this.productService.updateProduct(this.data.urunID, formData).subscribe({
          next: () => {
            this.showSuccess('Ürün başarıyla güncellendi');
            this.dialogRef.close({ ...formData, urunID: this.data?.urunID });
          },
          error: (error) => {
            console.error('Ürün güncellenirken hata oluştu:', error);
            this.showError('Ürün güncellenirken bir hata oluştu: ' + error);
          }
        });
      } else {
        this.productService.addProduct(formData).subscribe({
          next: (result) => {
            this.showSuccess('Ürün başarıyla eklendi');
            this.dialogRef.close(result);
          },
          error: (error) => {
            console.error('Ürün eklenirken hata oluştu:', error);
            this.showError('Ürün eklenirken bir hata oluştu: ' + error);
          }
        });
      }
    } else {
      this.showError('Lütfen tüm zorunlu alanları doldurun');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  removeImage(): void {
    this.productForm.patchValue({ urunGorseli: '' });
    this.previewUrl = null;
  }

  handleImageError(event: any): void {
    const img = event.target;
    img.src = 'https://dummyimage.com/400x300/e0e0e0/ffffff&text=Görsel+Yok';
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Kapat', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Kapat', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }
}

