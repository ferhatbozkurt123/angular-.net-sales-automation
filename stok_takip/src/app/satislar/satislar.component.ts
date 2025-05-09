import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SalesService, Sale } from '../services/sales.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-satislar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="container mt-4">
      <div class="header-section">
        <h2>Satış Listesi</h2>
        <div class="period-filters">
          <button mat-raised-button color="primary" [routerLink]="['/urunler']">
            <mat-icon>inventory</mat-icon>
            Geri Dön
          </button>
          <button mat-stroked-button 
                  [class.active]="selectedPeriod === 'day'" 
                  (click)="filterByPeriod('day')">
            <mat-icon>today</mat-icon>
            Günlük
          </button>
          <button mat-stroked-button 
                  [class.active]="selectedPeriod === 'week'" 
                  (click)="filterByPeriod('week')">
            <mat-icon>view_week</mat-icon>
            Haftalık
          </button>
          <button mat-stroked-button 
                  [class.active]="selectedPeriod === 'month'" 
                  (click)="filterByPeriod('month')">
            <mat-icon>calendar_today</mat-icon>
            Aylık
          </button>
          <button mat-stroked-button 
                  [class.active]="selectedPeriod === 'year'" 
                  (click)="filterByPeriod('year')">
            <mat-icon>calendar_view_month</mat-icon>
            Yıllık
          </button>
        </div>
      </div>

      <mat-card class="sales-card">
        <mat-card-content>
          <div class="search-section">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Müşteri Ara</mat-label>
              <input matInput [formControl]="searchControl" placeholder="Müşteri adı ile ara...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          <table mat-table [dataSource]="filteredSales" class="sales-table">
            <ng-container matColumnDef="satisID">
              <th mat-header-cell *matHeaderCellDef>Satış ID</th>
              <td mat-cell *matCellDef="let satis">{{satis.satisID}}</td>
            </ng-container>

            <ng-container matColumnDef="musteri">
              <th mat-header-cell *matHeaderCellDef>Müşteri</th>
              <td mat-cell *matCellDef="let satis">{{satis.musteri}}</td>
            </ng-container>

            <ng-container matColumnDef="satisTarihi">
              <th mat-header-cell *matHeaderCellDef>Tarih</th>
              <td mat-cell *matCellDef="let satis">{{satis.satisTarihi | date:'medium'}}</td>
            </ng-container>

            <ng-container matColumnDef="toplamTutar">
              <th mat-header-cell *matHeaderCellDef>Toplam Tutar</th>
              <td mat-cell *matCellDef="let satis" class="amount-cell">
                {{satis.toplamTutar | currency:'TRY':'symbol-narrow':'1.2-2'}}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>İşlemler</th>
              <td mat-cell *matCellDef="let satis">
                <button mat-icon-button color="primary" (click)="viewSaleDetails(satis)" matTooltip="Detay">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="editSale(satis)" matTooltip="Düzenle">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteSale(satis.satisID)" matTooltip="Sil">
                  <mat-icon>delete</mat-icon>
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
      padding: 24px;
      background-color: #ffffff;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h2 {
        color: #000000;
        font-weight: 600;
        font-size: 1.5rem;
        margin: 0;
      }
    }

    .period-filters {
      display: flex;
      gap: 12px;

      button {
        color: #000000;
        background-color: #ffffff;
        border-color: #e0e0e0;
        font-weight: 500;

        &.active {
          background-color: #ffffff;
          color: #000000;
          border-color: #000000;
        }

        mat-icon {
          margin-right: 8px;
          color: #000000;
        }
      }
    }

    .sales-card {
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
    }

    .search-section {
      margin-bottom: 20px;

      .search-field {
        width: 100%;
        max-width: 400px;

        ::ng-deep .mat-form-field-outline {
          color: #e0e0e0;
        }

        ::ng-deep .mat-form-field-label {
          color: #000000;
        }

        input {
          color: #000000;
        }
      }
    }

    .sales-table {
      width: 100%;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      overflow: hidden;

      th {
        background-color: #ffffff;
        color: #000000;
        font-weight: 600;
        padding: 16px;
        font-size: 1rem;
        border-bottom: 1px solid #e0e0e0;
      }

      td {
        background-color: #ffffff;
        padding: 12px 16px;
        color: #000000;
        font-weight: 500;
        border-bottom: 1px solid #f5f5f5;
      }

      .amount-cell {
        font-weight: 600;
        color: #000000;
      }

      tr:hover {
        background-color: #ffffff;
      }
    }

    .mat-column-actions {
      width: 160px;
      text-align: center;

      button {
        margin: 0 4px;
        color: #000000;
        
        .mat-icon {
          color: #000000;
        }
      }
    }
  `]
})
export class SatislarComponent implements OnInit {
  displayedColumns: string[] = ['satisID', 'musteri', 'satisTarihi', 'toplamTutar', 'actions'];
  sales: Sale[] = [];
  filteredSales: Sale[] = [];
  selectedPeriod: string = 'all';
  searchControl = new FormControl('');

  constructor(
    private salesService: SalesService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSales();
    this.setupSearch();
  }

  private setupSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      console.log('Arama terimi:', searchTerm); // Debug için log
      this.applyCurrentFilter();
    });
  }

  loadSales() {
    this.salesService.getSales().subscribe({
      next: (data) => {
        console.log('Yüklenen satışlar:', data); // Debug için log
        this.sales = data;
        this.filteredSales = data;
        this.applyCurrentFilter();
      },
      error: (error) => {
        console.error('Satışlar yüklenirken hata oluştu:', error);
        this.showError('Satışlar yüklenirken bir hata oluştu');
      }
    });
  }

  filterSales(searchTerm: string) {
    console.log('filterSales çağrıldı, terim:', searchTerm); // Debug için log
    if (!searchTerm) {
      this.filteredSales = this.applyPeriodFilter(this.sales);
      return;
    }

    const filtered = this.sales.filter(sale => 
      sale.musteri?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log('Filtrelenmiş sonuçlar:', filtered); // Debug için log
    this.filteredSales = this.applyPeriodFilter(filtered);
  }

  filterByPeriod(period: string) {
    this.selectedPeriod = period;
    this.applyCurrentFilter();
  }

  private applyCurrentFilter() {
    const searchTerm = this.searchControl.value;
    console.log('Mevcut arama terimi:', searchTerm); // Debug için log
    
    let filtered = [...this.sales];
    
    if (searchTerm) {
      filtered = filtered.filter(sale => 
        sale.musteri?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    console.log('Filtreleme sonrası:', filtered); // Debug için log
    this.filteredSales = this.applyPeriodFilter(filtered);
  }

  private applyPeriodFilter(sales: Sale[]): Sale[] {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (this.selectedPeriod) {
      case 'day':
        return sales.filter(s => new Date(s.satisTarihi) >= startOfDay);
      case 'week': {
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
        return sales.filter(s => new Date(s.satisTarihi) >= startOfWeek);
      }
      case 'month': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return sales.filter(s => new Date(s.satisTarihi) >= startOfMonth);
      }
      case 'year': {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return sales.filter(s => new Date(s.satisTarihi) >= startOfYear);
      }
      default:
        return sales;
    }
  }

  viewSaleDetails(sale: Sale) {
    this.router.navigate(['sales', 'sales-detail', sale.satisID]);
  }

  editSale(sale: Sale) {
    this.router.navigate(['sales', 'sales-update', sale.satisID]);
  }

  deleteSale(id: number) {
    if (confirm('Bu satışı silmek istediğinizden emin misiniz?')) {
      this.salesService.deleteSale(id).subscribe({
        next: () => {
          this.sales = this.sales.filter(s => s.satisID !== id);
          this.applyCurrentFilter();
          this.showSuccess('Satış başarıyla silindi');
        },
        error: (error) => {
          console.error('Satış silinirken hata oluştu:', error);
          this.showError('Satış silinirken bir hata oluştu');
        }
      });
    }
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Kapat', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Kapat', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
} 