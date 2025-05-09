import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SalesService, Sale } from '../../services/sales.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent implements OnInit {
  satislar: Sale[] = [];
  filteredSales: Sale[] = [];
  selectedPeriod: 'all' | 'day' | 'week' | 'month' | 'year' = 'all';
  displayedColumns: string[] = ['satisId', 'musteri', 'satisTarihi', 'toplamTutar', 'actions'];
  searchControl = new FormControl('');

  constructor(
    private salesService: SalesService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSales();
    
    // Arama filtresini dinle
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        if (searchTerm !== null) {  // null kontrolü ekleyin
          this.filterSales(searchTerm);
        }
      });
  }

  loadSales(): void {
    this.salesService.getSales().subscribe({
      next: (data) => {
        this.satislar = data;
        this.filteredSales = data;  // İlk yüklemede tüm verileri göster
        console.log('Yüklenen satışlar:', this.satislar); // Debug için
      },
      error: (error) => {
        console.error('Satışlar yüklenirken hata oluştu:', error);
        this.showError('Satışlar yüklenirken bir hata oluştu');
      }
    });
  }

  deleteSale(id: number): void {
    if (confirm('Bu satışı silmek istediğinizden emin misiniz?')) {
      this.salesService.deleteSale(id).subscribe({
        next: () => {
          this.satislar = this.satislar.filter(s => s.satisID !== id);
          this.filteredSales = this.filteredSales.filter(s => s.satisID !== id);
          this.showSuccess('Satış başarıyla silindi');
        },
        error: (error) => {
          console.error('Satış silinirken hata oluştu:', error);
          this.showError('Satış silinirken bir hata oluştu');
        }
      });
    }
  }

  filterByPeriod(period: 'all' | 'day' | 'week' | 'month' | 'year'): void {
    this.selectedPeriod = period;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (period) {
      case 'all':
        this.filteredSales = this.satislar;
        break;
      case 'day':
        this.filteredSales = this.satislar.filter(s => 
          new Date(s.satisTarihi) >= startOfDay
        );
        break;
      case 'week':
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
        this.filteredSales = this.satislar.filter(s => 
          new Date(s.satisTarihi) >= startOfWeek
        );
        break;
      case 'month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        this.filteredSales = this.satislar.filter(s => 
          new Date(s.satisTarihi) >= startOfMonth
        );
        break;
      case 'year':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        this.filteredSales = this.satislar.filter(s => 
          new Date(s.satisTarihi) >= startOfYear
        );
        break;
    }
  }

  getDailySalesTotal(): number {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return this.calculateTotal(this.satislar.filter(s => 
      new Date(s.satisTarihi) >= startOfDay
    ));
  }

  getWeeklySalesTotal(): number {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return this.calculateTotal(this.satislar.filter(s => 
      new Date(s.satisTarihi) >= startOfWeek
    ));
  }

  getMonthlySalesTotal(): number {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    return this.calculateTotal(this.satislar.filter(s => 
      new Date(s.satisTarihi) >= startOfMonth
    ));
  }

  getYearlySalesTotal(): number {
    const startOfYear = new Date();
    startOfYear.setMonth(0, 1);
    startOfYear.setHours(0, 0, 0, 0);
    return this.calculateTotal(this.satislar.filter(s => 
      new Date(s.satisTarihi) >= startOfYear
    ));
  }

  private calculateTotal(sales: Sale[]): number {
    return sales.reduce((sum, sale) => sum + sale.toplamTutar, 0);
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

  filterSales(searchTerm: string) {
    console.log('Arama terimi:', searchTerm);
    console.log('Filtreleme öncesi satışlar:', this.satislar);

    if (!searchTerm?.trim()) {
      this.filteredSales = [...this.satislar];
      this.cdr.detectChanges();
      return;
    }

    searchTerm = searchTerm.toLowerCase().trim();
    this.filteredSales = this.satislar.filter(sale => {
      if (!sale || !sale.musteri) {
        return false;
      }
      
      const musteriAdi = sale.musteri.toLowerCase();
      const isMatch = musteriAdi.includes(searchTerm);
      console.log(`Müşteri: ${musteriAdi}, Eşleşme: ${isMatch}`);
      return isMatch;
    });

    console.log('Filtrelenen satışlar:', this.filteredSales);
    this.cdr.detectChanges();
  }
} 