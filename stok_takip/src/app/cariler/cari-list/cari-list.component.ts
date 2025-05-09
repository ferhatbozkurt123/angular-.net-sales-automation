import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { CariService, Cari } from '../../services/cari.service';

@Component({
  selector: 'app-cari-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    FormsModule
  ],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Cari Listesi</h2>
        <button mat-raised-button color="primary" [routerLink]="['/cari/ekle']">
          <mat-icon>add</mat-icon>
          Yeni Cari Ekle
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="row mb-3">
            <div class="col-md-4">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Cari Ara</mat-label>
                <input matInput [(ngModel)]="searchTerm" (keyup)="search()" placeholder="Unvan ile ara...">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
            </div>
            <div class="col-md-4">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Tip Filtrele</mat-label>
                <mat-select [(ngModel)]="selectedTip" (selectionChange)="filterByTip()">
                  <mat-option value="">Tümü</mat-option>
                  <mat-option value="Müşteri">Müşteri</mat-option>
                  <mat-option value="Tedarikçi">Tedarikçi</mat-option>
                  <mat-option value="Bayi">Bayi</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>

          <div *ngIf="loading" class="loading-spinner">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Cariler yükleniyor...</p>
          </div>

          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>

          <table mat-table [dataSource]="cariler" class="w-100" *ngIf="!loading && !error">
            <ng-container matColumnDef="unvan">
              <th mat-header-cell *matHeaderCellDef>Unvan</th>
              <td mat-cell *matCellDef="let cari">{{cari.unvan}}</td>
            </ng-container>

            <ng-container matColumnDef="tip">
              <th mat-header-cell *matHeaderCellDef>Tip</th>
              <td mat-cell *matCellDef="let cari">{{cari.tip}}</td>
            </ng-container>

            <ng-container matColumnDef="telefon">
              <th mat-header-cell *matHeaderCellDef>Telefon</th>
              <td mat-cell *matCellDef="let cari">{{cari.telefon || '-'}}</td>
            </ng-container>

            <ng-container matColumnDef="bakiye">
              <th mat-header-cell *matHeaderCellDef>Bakiye</th>
              <td mat-cell *matCellDef="let cari" [ngClass]="{'text-danger': cari.bakiye < 0, 'text-success': cari.bakiye > 0}">
                {{cari.bakiye | currency:'TRY':'symbol-narrow':'1.2-2'}}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>İşlemler</th>
              <td mat-cell *matCellDef="let cari">
                <button mat-icon-button color="primary" [routerLink]="['/cari/detay', cari.cariID]" matTooltip="Detay">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="accent" [routerLink]="['/cari/duzenle', cari.cariID]" matTooltip="Düzenle">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteCari(cari.cariID)" matTooltip="Sil">
                  <mat-icon>delete</mat-icon>
                </button>
                <button mat-icon-button color="primary" [routerLink]="['/cari/hareket/ekle', cari.cariID]" matTooltip="Hareket Ekle">
                  <mat-icon>add_circle</mat-icon>
                </button>
              </td>
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

    h2 {
      color: #000000;
      font-weight: 500;
    }

    mat-card {
      background-color: #ffffff !important;
      border: 1px solid #e0e0e0;
      margin-bottom: 20px;
    }

    .mat-mdc-form-field {
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
        .mat-mdc-select-value-text {
          color: #000000;
        }
        .mat-mdc-select-arrow {
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

    .mat-mdc-row:hover {
      background-color: #f5f5f5;
    }

    .text-danger {
      color: #dc3545;
    }

    .text-success {
      color: #28a745;
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

      .mat-mdc-icon-button {
        color: #000000 !important;
        
        .mat-icon {
          color: #000000 !important;
        }
      }

      .mat-mdc-select-panel {
        background-color: #ffffff !important;
      }

      .mat-mdc-option {
        color: #000000 !important;
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

    .error-message {
      color: #dc3545;
      text-align: center;
      padding: 1rem;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      margin: 1rem 0;
    }

    .mat-column-actions {
      width: 160px;
      text-align: center;
    }

    .search-filters {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    @media screen and (max-width: 768px) {
      .container {
        padding: 10px;
      }
      
      .search-filters {
        flex-direction: column;
        gap: 10px;
      }
      
      .mat-column-actions {
        width: auto;
      }
    }
  `]
})
export class CariListComponent implements OnInit {
  cariler: Cari[] = [];
  displayedColumns: string[] = ['unvan', 'tip', 'telefon', 'bakiye', 'actions'];
  searchTerm: string = '';
  selectedTip: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private cariService: CariService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCariler();
  }

  loadCariler(): void {
    this.loading = true;
    this.error = '';

    this.cariService.getCariler().subscribe({
      next: (data) => {
        console.log('Cariler yüklendi:', data);
        this.cariler = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Cariler yüklenirken hata:', error);
        this.error = 'Cariler yüklenirken bir hata oluştu';
        this.loading = false;
        this.showError(this.error);
      }
    });
  }

  search(): void {
    if (this.searchTerm.trim()) {
      this.cariService.searchCariler(this.searchTerm).subscribe({
        next: (data) => {
          this.cariler = data;
        },
        error: (error) => {
          console.error('Arama sırasında hata:', error);
          this.showError('Arama yapılırken bir hata oluştu');
        }
      });
    } else {
      this.loadCariler();
    }
  }

  filterByTip(): void {
    if (this.selectedTip) {
      this.cariService.getCarilerByTip(this.selectedTip).subscribe({
        next: (data) => {
          this.cariler = data;
        },
        error: (error) => {
          console.error('Filtreleme sırasında hata:', error);
          this.showError('Filtreleme yapılırken bir hata oluştu');
        }
      });
    } else {
      this.loadCariler();
    }
  }

  deleteCari(id: number): void {
    if (confirm('Bu cariyi silmek istediğinizden emin misiniz?')) {
      this.cariService.deleteCari(id).subscribe({
        next: () => {
          this.showSuccess('Cari başarıyla silindi');
          this.loadCariler();
        },
        error: (error) => {
          console.error('Cari silinirken hata:', error);
          this.showError('Cari silinirken bir hata oluştu');
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