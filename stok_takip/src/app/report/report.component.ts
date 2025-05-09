import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { SalesService } from '../services/sales.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NgChartsModule
  ],
  template: `
    <div class="reports-container">
      <mat-tab-group>
        <!-- Satış İstatistikleri -->
        <mat-tab label="Satış İstatistikleri">
          <div class="tab-content">
            <div class="stats-grid">
              <!-- Günlük Satış Kartı -->
              <mat-card class="stat-card">
                <mat-card-header>
                  <mat-icon class="stat-icon">today</mat-icon>
                  <mat-card-title>Günlük Satış</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="stat-value">₺{{ dailySales | number:'1.2-2' }}</div>
                  <div class="stat-comparison" [ngClass]="{'positive': dailyGrowth > 0, 'negative': dailyGrowth < 0}">
                    <mat-icon>{{ dailyGrowth > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
                    {{ dailyGrowth }}% geçen güne göre
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Haftalık Satış Kartı -->
              <mat-card class="stat-card">
                <mat-card-header>
                  <mat-icon class="stat-icon">date_range</mat-icon>
                  <mat-card-title>Haftalık Satış</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="stat-value">₺{{ weeklySales | number:'1.2-2' }}</div>
                  <div class="stat-comparison" [ngClass]="{'positive': weeklyGrowth > 0, 'negative': weeklyGrowth < 0}">
                    <mat-icon>{{ weeklyGrowth > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
                    {{ weeklyGrowth }}% geçen haftaya göre
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Aylık Satış Kartı -->
              <mat-card class="stat-card">
                <mat-card-header>
                  <mat-icon class="stat-icon">calendar_today</mat-icon>
                  <mat-card-title>Aylık Satış</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="stat-value">₺{{ monthlySales | number:'1.2-2' }}</div>
                  <div class="stat-comparison" [ngClass]="{'positive': monthlyGrowth > 0, 'negative': monthlyGrowth < 0}">
                    <mat-icon>{{ monthlyGrowth > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
                    {{ monthlyGrowth }}% geçen aya göre
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Ortalama Satış Kartı -->
              <mat-card class="stat-card">
                <mat-card-header>
                  <mat-icon class="stat-icon">analytics</mat-icon>
                  <mat-card-title>Ortalama Satış</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="stat-value">₺{{ averageSale | number:'1.2-2' }}</div>
                  <div class="stat-subtitle">Satış başına ortalama tutar</div>
                </mat-card-content>
              </mat-card>
            </div>

            <!-- Satış Trendi Grafiği -->
            <mat-card class="chart-card">
              <mat-card-header>
                <mat-icon class="chart-icon">show_chart</mat-icon>
                <mat-card-title>Satış Trendi</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <canvas baseChart
                  [data]="salesChartData"
                  [options]="salesChartOptions"
                  [type]="'line'">
                </canvas>
              </mat-card-content>
            </mat-card>

            <!-- Satış Dağılımı -->
            <mat-card class="chart-card">
              <mat-card-header>
                <mat-icon class="chart-icon">pie_chart</mat-icon>
                <mat-card-title>Satış Dağılımı</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <canvas baseChart
                  [data]="salesDistributionData"
                  [options]="salesDistributionOptions"
                  [type]="'pie'">
                </canvas>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Ürün İstatistikleri -->
        <mat-tab label="Ürün İstatistikleri">
          <div class="tab-content">
            <div class="stats-grid">
              <!-- Toplam Ürün Sayısı -->
              <mat-card class="stat-card">
                <mat-card-header>
                  <mat-icon class="stat-icon">inventory_2</mat-icon>
                  <mat-card-title>Toplam Ürün</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="stat-value">{{ totalProducts }}</div>
                  <div class="stat-subtitle">Aktif ürün sayısı</div>
                </mat-card-content>
              </mat-card>

              <!-- Kritik Stok -->
              <mat-card class="stat-card warning">
                <mat-card-header>
                  <mat-icon class="stat-icon">warning</mat-icon>
                  <mat-card-title>Kritik Stok</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="stat-value">{{ lowStockCount }}</div>
                  <div class="stat-subtitle">Stok takibi gereken ürün</div>
                </mat-card-content>
              </mat-card>

              <!-- Tükenen Ürünler -->
              <mat-card class="stat-card danger">
                <mat-card-header>
                  <mat-icon class="stat-icon">error</mat-icon>
                  <mat-card-title>Tükenen Ürünler</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="stat-value">{{ outOfStockCount }}</div>
                  <div class="stat-subtitle">Stokta olmayan ürün</div>
                </mat-card-content>
              </mat-card>

              <!-- Ortalama Stok Değeri -->
              <mat-card class="stat-card">
                <mat-card-header>
                  <mat-icon class="stat-icon">account_balance</mat-icon>
                  <mat-card-title>Stok Değeri</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="stat-value">₺{{ totalStockValue | number:'1.2-2' }}</div>
                  <div class="stat-subtitle">Toplam stok değeri</div>
                </mat-card-content>
              </mat-card>
            </div>

            <!-- En Çok Satan Ürünler -->
            <mat-card class="chart-card">
              <mat-card-header>
                <mat-icon class="chart-icon">bar_chart</mat-icon>
                <mat-card-title>En Çok Satan Ürünler</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <canvas baseChart
                  [data]="topProductsChartData"
                  [options]="topProductsChartOptions"
                  [type]="'bar'">
                </canvas>
              </mat-card-content>
            </mat-card>

            <!-- Stok Durumu -->
            <mat-card class="chart-card">
              <mat-card-header>
                <mat-icon class="chart-icon">donut_large</mat-icon>
                <mat-card-title>Stok Durumu</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <canvas baseChart
                  [data]="stockChartData"
                  [options]="stockChartOptions"
                  [type]="'doughnut'">
                </canvas>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
      background-color: #ffffff;
      color: #000000;
    }

    .tab-content {
      padding: 24px 0;
      background-color: #ffffff;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .stat-card {
      padding: 16px;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      transition: transform 0.2s, box-shadow 0.2s;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      &.warning {
        border-left: 4px solid #ff9800;
      }

      &.danger {
        border-left: 4px solid #f44336;
      }
      
      .mat-mdc-card-header {
        padding: 0;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
      }

      .stat-icon {
        margin-right: 8px;
        color: #666;
      }

      .mat-mdc-card-title {
        font-size: 1.1rem;
        color: #000000;
        margin: 0;
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 500;
        color: #000000;
        text-align: center;
        margin-bottom: 8px;
      }

      .stat-subtitle {
        color: #666;
        text-align: center;
        font-size: 0.9rem;
      }

      .stat-comparison {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
        margin-top: 8px;

        &.positive {
          color: #4caf50;
        }

        &.negative {
          color: #f44336;
        }

        mat-icon {
          font-size: 18px;
          height: 18px;
          width: 18px;
          margin-right: 4px;
        }
      }
    }

    .chart-card {
      margin-bottom: 24px;
      padding: 16px;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;

      .mat-mdc-card-header {
        padding: 0;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
      }

      .chart-icon {
        margin-right: 8px;
        color: #666;
      }

      .mat-mdc-card-title {
        font-size: 1.2rem;
        color: #000000;
        margin: 0;
      }

      canvas {
        width: 100% !important;
        height: 300px !important;
      }
    }

    ::ng-deep {
      .mat-mdc-tab-group {
        background-color: #ffffff;
      }

      .mat-mdc-tab-label {
        color: #000000 !important;
      }

      .mat-mdc-tab-label-active {
        color: #000000 !important;
        font-weight: bold;
      }

      .mat-mdc-card {
        background-color: #ffffff;
        color: #000000;
      }

      .mat-mdc-card-title {
        color: #000000 !important;
      }

      .mat-mdc-card-content {
        color: #000000;
      }
    }
  `]
})
export class ReportComponent implements OnInit {
  // Satış istatistikleri
  dailySales: number = 0;
  weeklySales: number = 0;
  monthlySales: number = 0;
  averageSale: number = 0;
  dailyGrowth: number = 0;
  weeklyGrowth: number = 0;
  monthlyGrowth: number = 0;

  // Ürün istatistikleri
  totalProducts: number = 0;
  lowStockCount: number = 0;
  outOfStockCount: number = 0;
  totalStockValue: number = 0;

  // Satış trendi grafiği
  salesChartData: ChartData = {
    labels: [],
    datasets: [{
      label: 'Günlük Satışlar',
      data: [],
      borderColor: '#1976d2',
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(25, 118, 210, 0.1)'
    }]
  };

  salesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => '₺' + value
        }
      }
    }
  };

  // Satış dağılımı grafiği
  salesDistributionData: ChartData = {
    labels: ['Nakit', 'Kredi Kartı', 'Havale'],
    datasets: [{
      data: [30, 50, 20],
      backgroundColor: ['#4caf50', '#2196f3', '#ff9800']
    }]
  };

  salesDistributionOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    }
  };

  // En çok satan ürünler grafiği
  topProductsChartData: ChartData = {
    labels: [],
    datasets: [{
      label: 'Satış Adedi',
      data: [],
      backgroundColor: [
        '#1976d2',
        '#2196f3',
        '#64b5f6',
        '#90caf9',
        '#bbdefb'
      ]
    }]
  };

  topProductsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Stok durumu grafiği
  stockChartData: ChartData = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#4caf50',
        '#ff9800',
        '#f44336'
      ]
    }]
  };

  stockChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    }
  };

  constructor(
    private salesService: SalesService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadSalesStatistics();
    this.loadSalesChart();
    this.loadTopProducts();
    this.loadStockStatus();
    this.calculateGrowthRates();
  }

  private loadSalesStatistics() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const oneWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const oneMonthAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    this.salesService.getSalesByDateRange(oneDayAgo, now).subscribe(sales => {
      this.dailySales = sales.reduce((sum, sale) => sum + sale.toplamTutar, 0);
      this.averageSale = sales.length > 0 ? this.dailySales / sales.length : 0;
    });

    this.salesService.getSalesByDateRange(oneWeekAgo, now).subscribe(sales => {
      this.weeklySales = sales.reduce((sum, sale) => sum + sale.toplamTutar, 0);
    });

    this.salesService.getSalesByDateRange(oneMonthAgo, now).subscribe(sales => {
      this.monthlySales = sales.reduce((sum, sale) => sum + sale.toplamTutar, 0);
    });
  }

  private calculateGrowthRates() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const twoDaysAgo = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000));
    const oneWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const twoWeeksAgo = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));
    const oneMonthAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const twoMonthsAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

    // Günlük büyüme oranı
    this.salesService.getSalesByDateRange(twoDaysAgo, oneDayAgo).subscribe(previousDaySales => {
      const previousDayTotal = previousDaySales.reduce((sum, sale) => sum + sale.toplamTutar, 0);
      if (previousDayTotal > 0) {
        this.dailyGrowth = Math.round(((this.dailySales - previousDayTotal) / previousDayTotal) * 100);
      }
    });

    // Haftalık büyüme oranı
    this.salesService.getSalesByDateRange(twoWeeksAgo, oneWeekAgo).subscribe(previousWeekSales => {
      const previousWeekTotal = previousWeekSales.reduce((sum, sale) => sum + sale.toplamTutar, 0);
      if (previousWeekTotal > 0) {
        this.weeklyGrowth = Math.round(((this.weeklySales - previousWeekTotal) / previousWeekTotal) * 100);
      }
    });

    // Aylık büyüme oranı
    this.salesService.getSalesByDateRange(twoMonthsAgo, oneMonthAgo).subscribe(previousMonthSales => {
      const previousMonthTotal = previousMonthSales.reduce((sum, sale) => sum + sale.toplamTutar, 0);
      if (previousMonthTotal > 0) {
        this.monthlyGrowth = Math.round(((this.monthlySales - previousMonthTotal) / previousMonthTotal) * 100);
      }
    });
  }

  private loadSalesChart() {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    this.salesService.getSalesByDateRange(oneWeekAgo, now).subscribe(sales => {
      const dailySales = new Map<string, number>();
      
      sales.forEach(sale => {
        const date = new Date(sale.satisTarihi).toLocaleDateString();
        dailySales.set(date, (dailySales.get(date) || 0) + sale.toplamTutar);
      });

      this.salesChartData = {
        labels: Array.from(dailySales.keys()),
        datasets: [{
          label: 'Günlük Satışlar',
          data: Array.from(dailySales.values()),
          borderColor: '#1976d2',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(25, 118, 210, 0.1)'
        }]
      };
    });
  }

  private loadTopProducts() {
    this.salesService.getSalesSummary().subscribe(summary => {
      if (summary && summary.topProducts) {
        this.topProductsChartData = {
          labels: summary.topProducts.map((p: any) => p.urunAdi),
          datasets: [{
            label: 'Satış Adedi',
            data: summary.topProducts.map((p: any) => p.satisAdedi),
            backgroundColor: [
              '#1976d2',
              '#2196f3',
              '#64b5f6',
              '#90caf9',
              '#bbdefb'
            ]
          }]
        };
      }
    });
  }

  private loadStockStatus() {
    this.productService.getProducts().subscribe(products => {
      this.totalProducts = products.length;
      this.lowStockCount = products.filter(p => p.stokMiktari > 0 && p.stokMiktari <= 5).length;
      this.outOfStockCount = products.filter(p => p.stokMiktari === 0).length;
      this.totalStockValue = products.reduce((sum, p) => sum + (p.stokMiktari * p.fiyat), 0);

      const stockStatus = {
        yeterli: products.filter(p => p.stokMiktari > 20).length,
        azalan: products.filter(p => p.stokMiktari > 5 && p.stokMiktari <= 20).length,
        kritik: products.filter(p => p.stokMiktari <= 5).length
      };

      this.stockChartData = {
        labels: ['Yeterli Stok', 'Azalan Stok', 'Kritik Stok'],
        datasets: [{
          data: [stockStatus.yeterli, stockStatus.azalan, stockStatus.kritik],
          backgroundColor: ['#4caf50', '#ff9800', '#f44336']
        }]
      };
    });
  }
}