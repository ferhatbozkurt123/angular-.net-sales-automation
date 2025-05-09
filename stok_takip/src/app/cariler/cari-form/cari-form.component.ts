import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CariService } from '../../services/cari.service';

@Component({
  selector: 'app-cari-form',
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
    MatSnackBarModule
  ],
  template: `
    <div class="container mt-4">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{isEditMode ? 'Cari Düzenle' : 'Yeni Cari Ekle'}}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="cariForm" (ngSubmit)="onSubmit()" class="form-container">
            <mat-form-field appearance="outline">
              <mat-label>Unvan</mat-label>
              <input matInput formControlName="unvan" placeholder="Cari unvanını giriniz">
              <mat-error *ngIf="cariForm.get('unvan')?.hasError('required')">
                Unvan zorunludur
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Tip</mat-label>
              <mat-select formControlName="tip">
                <mat-option value="Müsteri">Müşteri</mat-option>
                <mat-option value="Tedarikçi">Tedarikçi</mat-option>
                <mat-option value="Bayi">Bayi</mat-option>
              </mat-select>
              <mat-error *ngIf="cariForm.get('tip')?.hasError('required')">
                Tip zorunludur
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Vergi Dairesi</mat-label>
              <input matInput formControlName="vergiDairesi" placeholder="Vergi dairesini giriniz">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Vergi No</mat-label>
              <input matInput formControlName="vergiNo" placeholder="Vergi numarasını giriniz">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Telefon</mat-label>
              <input matInput formControlName="telefon" placeholder="Telefon numarasını giriniz">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>E-posta</mat-label>
              <input matInput formControlName="eposta" placeholder="E-posta adresini giriniz" type="email">
              <mat-error *ngIf="cariForm.get('eposta')?.hasError('email')">
                Geçerli bir e-posta adresi giriniz
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Adres</mat-label>
              <textarea matInput formControlName="adres" placeholder="Adresi giriniz" rows="3"></textarea>
            </mat-form-field>

            <div class="button-container">
              <button mat-button type="button" [routerLink]="['/cari/liste']">İptal</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="!cariForm.valid">
                {{isEditMode ? 'Güncelle' : 'Kaydet'}}
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
    }
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
    }
    .button-container {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
    mat-card-title {
      margin-bottom: 20px;
    }
  `]
})
export class CariFormComponent implements OnInit {
  cariForm: FormGroup;
  isEditMode = false;
  cariId?: number;

  constructor(
    private fb: FormBuilder,
    private cariService: CariService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.cariForm = this.fb.group({
      unvan: ['', Validators.required],
      tip: ['', Validators.required],
      vergiDairesi: [''],
      vergiNo: [''],
      telefon: [''],
      eposta: ['', [Validators.email]],
      adres: [''],
      bakiye: [0]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.cariId = +params['id'];
        this.loadCariData();
      }
    });
  }

  loadCariData(): void {
    if (this.cariId) {
      this.cariService.getCariById(this.cariId).subscribe({
        next: (cari) => {
          this.cariForm.patchValue(cari);
        },
        error: (error) => {
          console.error('Cari yüklenirken hata oluştu:', error);
          this.showError('Cari yüklenirken bir hata oluştu');
          this.router.navigate(['/cari/liste']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.cariForm.valid) {
      const cariData = this.cariForm.value;
      
      if (this.isEditMode && this.cariId) {
        this.cariService.updateCari(this.cariId, cariData).subscribe({
          next: () => {
            this.showSuccess('Cari başarıyla güncellendi');
            this.router.navigate(['/cari/liste']);
          },
          error: (error) => {
            console.error('Cari güncellenirken hata oluştu:', error);
            this.showError('Cari güncellenirken bir hata oluştu');
          }
        });
      } else {
        this.cariService.createCari(cariData).subscribe({
          next: () => {
            this.showSuccess('Cari başarıyla oluşturuldu');
            this.router.navigate(['/cari/liste']);
          },
          error: (error) => {
            console.error('Cari oluşturulurken hata oluştu:', error);
            this.showError('Cari oluşturulurken bir hata oluştu');
          }
        });
      }
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