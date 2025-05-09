import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CariService, Cari, CariHareket } from '../../services/cari.service';

@Component({
  selector: 'app-cari-detay',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="container mt-4">
      <mat-card class="cari-card">
        <mat-card-header>
          <mat-card-title>Cari Detayları</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="cari-info" *ngIf="cari">
            <p><strong>Unvan:</strong> {{cari.unvan}}</p>
            <p><strong>Tip:</strong> {{cari.tip}}</p>
            <p><strong>Telefon:</strong> {{cari.telefon || '-'}}</p>
            <p><strong>Email:</strong> {{cari.email || '-'}}</p>
            <p><strong>Vergi Dairesi:</strong> {{cari.vergiDairesi || '-'}}</p>
            <p><strong>Vergi No:</strong> {{cari.vergiNo || '-'}}</p>
            <p><strong>Bakiye:</strong> {{cari.bakiye | currency:'TRY':'symbol-narrow':'1.2-2'}}</p>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Tarih Filtresi -->
      <mat-card class="filter-card">
        <mat-card-content>
          <form [formGroup]="dateFilterForm" class="date-filter-form">
            <mat-form-field appearance="outline">
              <mat-label>Başlangıç Tarihi</mat-label>
              <input matInput [matDatepicker]="startPicker" formControlName="startDate">
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Bitiş Tarihi</mat-label>
              <input matInput [matDatepicker]="endPicker" formControlName="endDate">
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>

            <button mat-raised-button (click)="filterByDate()">
              <mat-icon>filter_list</mat-icon>
              Filtrele
            </button>
            <button mat-raised-button (click)="resetFilter()">
              <mat-icon>clear</mat-icon>
              Filtreyi Temizle
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Hareket Tablosu -->
      <mat-card class="movements-card">
        <mat-card-header>
          <mat-card-title>Cari Hareketler</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="hareketler" class="w-100">
            <ng-container matColumnDef="islemTarihi">
              <th mat-header-cell *matHeaderCellDef>Tarih</th>
              <td mat-cell *matCellDef="let hareket">{{hareket.islemTarihi | date:'medium'}}</td>
            </ng-container>

            <ng-container matColumnDef="islemTuru">
              <th mat-header-cell *matHeaderCellDef>İşlem Türü</th>
              <td mat-cell *matCellDef="let hareket">{{hareket.islemTuru}}</td>
            </ng-container>

            <ng-container matColumnDef="tutar">
              <th mat-header-cell *matHeaderCellDef>Tutar</th>
              <td mat-cell *matCellDef="let hareket" 
                  [ngClass]="{'text-success': hareket.islemTuru === 'Tahsilat', 'text-danger': hareket.islemTuru === 'Borç'}">
                {{hareket.tutar | currency:'TRY':'symbol-narrow':'1.2-2'}}
              </td>
            </ng-container>

            <ng-container matColumnDef="aciklama">
              <th mat-header-cell *matHeaderCellDef>Açıklama</th>
              <td mat-cell *matCellDef="let hareket">{{hareket.aciklama || '-'}}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
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

    .cari-card, .movements-card, .filter-card {
      background-color: #ffffff !important;
      border: 1px solid #e0e0e0;
      margin-bottom: 20px;

      mat-card-title {
        color: #000000;
        font-weight: 500;
      }
    }

    .cari-info {
      padding: 16px;
      
      p {
        color: #000000;
        margin: 8px 0;
        
        strong {
          color: #000000;
          font-weight: 500;
        }
      }
    }

    .date-filter-form {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;

      mat-form-field {
        flex: 1;
        min-width: 200px;
        
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
        }
      }

      button {
        height: 56px;
        background-color: #ffffff;
        color: #000000;
        border: 1px solid #000000;

        mat-icon {
          color: #000000;
        }
      }
    }

    .mat-mdc-table {
      width: 100%;
      background-color: #ffffff;

      .mat-mdc-header-cell {
        color: #000000;
        font-weight: 600;
      }

      .mat-mdc-cell {
        color: #000000;
      }
    }

    .text-success {
      color: #28a745;
    }

    .text-danger {
      color: #dc3545;
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
    }

    @media (max-width: 768px) {
      .date-filter-form {
        flex-direction: column;
        
        button {
          width: 100%;
        }
      }
    }
  `]
})
export class CariDetayComponent implements OnInit {
  cariId!: number;
  cari?: Cari;
  hareketler: CariHareket[] = [];
  displayedColumns: string[] = ['islemTarihi', 'islemTuru', 'tutar', 'aciklama'];
  dateFilterForm: FormGroup;
  allHareketler: CariHareket[] = []; // Tüm hareketleri saklayacak array

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cariService: CariService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.dateFilterForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.cariId = +params['id'];
      this.loadCariData();
      this.loadCariHareketler();
    });
  }

  loadCariData(): void {
    this.cariService.getCariById(this.cariId).subscribe({
      next: (data) => {
        this.cari = data;
      },
      error: (error) => {
        this.showError('Cari bilgileri yüklenirken bir hata oluştu');
      }
    });
  }

  loadCariHareketler(): void {
    this.cariService.getCariHareketlerByCariId(this.cariId).subscribe({
      next: (data) => {
        this.allHareketler = data; // Tüm hareketleri sakla
        this.hareketler = data; // Görüntülenen hareketleri ayarla
      },
      error: (error) => {
        this.showError('Cari hareketler yüklenirken bir hata oluştu');
      }
    });
  }

  filterByDate(): void {
    const startDate = this.dateFilterForm.get('startDate')?.value;
    const endDate = this.dateFilterForm.get('endDate')?.value;

    if (!startDate || !endDate) {
      this.showError('Lütfen başlangıç ve bitiş tarihlerini seçin');
      return;
    }

    // Tarihleri başlangıç ve bitiş saatlerini ayarlayarak karşılaştır
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    this.hareketler = this.allHareketler.filter(hareket => {
      if (!hareket.islemTarihi) {
        return false; // islemTarihi yoksa filtreleme dışında bırak
      }

      const hareketTarihi = hareket.islemTarihi instanceof Date 
        ? hareket.islemTarihi 
        : new Date(hareket.islemTarihi);
        
      return hareketTarihi >= start && hareketTarihi <= end;
    });
  }

  resetFilter(): void {
    this.dateFilterForm.reset();
    this.hareketler = this.allHareketler;
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