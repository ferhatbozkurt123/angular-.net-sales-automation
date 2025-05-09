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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CariService, Cari } from '../../services/cari.service';

@Component({
  selector: 'app-cari-hareket-form',
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
    MatSnackBarModule
  ],
  template: `
    <div class="container mt-4">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Yeni Cari Hareket</mat-card-title>
          <mat-card-subtitle *ngIf="cari">{{cari.unvan}}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="hareketForm" (ngSubmit)="onSubmit()" class="form-container">
            <mat-form-field appearance="outline">
              <mat-label>İşlem Türü</mat-label>
              <mat-select formControlName="islemTuru">
                <mat-option value="Borc">Borç</mat-option>
                <mat-option value="Alacak">Alacak</mat-option>
                <mat-option value="Tahsilat">Tahsilat</mat-option>
                <mat-option value="Odeme">Ödeme</mat-option>
              </mat-select>
              <mat-error *ngIf="hareketForm.get('islemTuru')?.hasError('required')">
                İşlem türü zorunludur
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Tutar</mat-label>
              <input matInput type="number" formControlName="tutar" placeholder="Tutarı giriniz">
              <mat-error *ngIf="hareketForm.get('tutar')?.hasError('required')">
                Tutar zorunludur
              </mat-error>
              <mat-error *ngIf="hareketForm.get('tutar')?.hasError('min')">
                Tutar 0'dan büyük olmalıdır
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Belge No</mat-label>
              <input matInput formControlName="belgeNo" placeholder="Belge numarası giriniz">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Vade Tarihi</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="vadeTarihi">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Açıklama</mat-label>
              <textarea matInput formControlName="aciklama" placeholder="Açıklama giriniz" rows="3"></textarea>
            </mat-form-field>

            <div class="button-container">
              <button mat-button type="button" [routerLink]="['/cari/detay', cariId]">İptal</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="!hareketForm.valid">
                Kaydet
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

    .cari-info {
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

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 8px;
      }

      .actions {
        flex-direction: column;
        
        button {
          width: 100%;
        }
      }
    }
  `]
})
export class CariHareketFormComponent implements OnInit {
  hareketForm: FormGroup;
  cariId!: number;
  cari?: Cari;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cariService: CariService,
    private snackBar: MatSnackBar
  ) {
    this.hareketForm = this.fb.group({
      islemTuru: ['', Validators.required],
      tutar: ['', [Validators.required, Validators.min(0.01)]],
      belgeNo: [''],
      vadeTarihi: [new Date()],
      aciklama: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.cariId = +params['id'];
        this.loadCariData();
      } else {
        this.router.navigate(['/cari/liste']);
      }
    });
  }

  loadCariData(): void {
    this.cariService.getCariById(this.cariId).subscribe({
      next: (data) => {
        this.cari = data;
      },
      error: (error) => {
        console.error('Cari bilgileri yüklenirken hata oluştu:', error);
        this.showError('Cari bilgileri yüklenirken bir hata oluştu');
        this.router.navigate(['/cari/liste']);
      }
    });
  }

  onSubmit(): void {
    if (this.hareketForm.valid) {
      const hareketData = {
        cariID: this.cariId,
        islemTuru: this.hareketForm.value.islemTuru,
        tutar: this.hareketForm.value.tutar,
        belgeNo: this.hareketForm.value.belgeNo || null,
        vadeTarihi: this.hareketForm.value.vadeTarihi,
        aciklama: this.hareketForm.value.aciklama || null
      };

      console.log('Gönderilecek cari hareket verisi:', hareketData);

      this.cariService.createCariHareket(hareketData).subscribe({
        next: (response) => {
          console.log('Cari hareket başarıyla oluşturuldu:', response);
          this.showSuccess('Cari hareket başarıyla kaydedildi');
          this.router.navigate(['/cari/detay', this.cariId]);
        },
        error: (error) => {
          console.error('Cari hareket oluşturulurken hata:', error);
          let errorMessage = 'Cari hareket oluşturulurken bir hata oluştu';
          
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this.showError(errorMessage);
        }
      });
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Kapat', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
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