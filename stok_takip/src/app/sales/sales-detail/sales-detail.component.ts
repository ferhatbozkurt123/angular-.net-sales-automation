import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SalesService, Sale, SaleDetail } from '../../services/sales.service';
import { forkJoin } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sales-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './sales-detail.component.html',
  styleUrls: ['./sales-detail.component.scss']
})
export class SalesDetailComponent implements OnInit {
  saleId!: number;
  sale?: Sale;
  saleDetails: SaleDetail[] = [];
  displayedColumns: string[] = ['urunId', 'urunAdi', 'miktar', 'birimFiyat', 'toplamFiyat'];
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salesService: SalesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log('Route params:', params);
      
      const id = params.get('id');
      console.log('Extracted ID:', id);

      if (!id) {
        this.showError('Satış ID bulunamadı');
        this.router.navigate(['/satislar']);
        return;
      }

      this.saleId = parseInt(id, 10);
      console.log('Parsed saleId:', this.saleId);

      if (isNaN(this.saleId)) {
        this.showError('Geçersiz satış ID formatı');
        this.router.navigate(['/satislar']);
        return;
      }

      this.loadSaleDetails();
    });
  }

  loadSaleDetails() {
    this.isLoading = true;
    this.error = null;

    console.log('Loading sale details for ID:', this.saleId);

    // Önce satış bilgilerini al
    this.salesService.getSaleById(this.saleId).subscribe({
      next: (saleData) => {
        console.log('Sale data received:', saleData);
        this.sale = saleData;
        
        // Sonra satış detaylarını al
        this.salesService.getSaleDetailsBySaleId(this.saleId).subscribe({
          next: (detailsData) => {
            console.log('Sale details received:', detailsData);
            // Ürün adını kontrol et ve ata
            this.saleDetails = detailsData.map(detail => ({
              ...detail,
              urunAdi: detail.urun?.urunAdi || detail.urunAdi || 'Bilinmeyen Ürün'
            }));
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Sale details error:', error);
            this.error = 'Satış detayları yüklenirken bir hata oluştu';
            this.isLoading = false;
            this.showError(this.error);
          }
        });
      },
      error: (error) => {
        console.error('Sale data error:', error);
        this.error = 'Satış bilgileri yüklenirken bir hata oluştu';
        this.isLoading = false;
        this.showError(this.error);
      }
    });
  }

  // Para birimi formatı için yardımcı metod
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: 'TRY' 
    }).format(value);
  }

  private showError(message: string): void {
    console.error('Error shown to user:', message);
    this.snackBar.open(message, 'Kapat', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
} 