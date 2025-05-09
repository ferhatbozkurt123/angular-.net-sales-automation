import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { SalesService, Sale } from '../../services/sales.service';
import { SatisOlustur } from '../../models/satis.model';

@Component({
  selector: 'app-sales-update',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mt-4">
      @if (satis) {
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3>Satış Düzenle #{{ satis.satisID }}</h3>
            <button class="btn btn-primary" routerLink="/satislar">Listeye Dön</button>
          </div>
          <div class="card-body">
            <form (ngSubmit)="onSubmit()" #salesForm="ngForm">
              <div class="mb-3">
                <label for="musteri" class="form-label">Müşteri Adı</label>
                <input
                  type="text"
                  class="form-control"
                  id="musteri"
                  name="musteri"
                  [(ngModel)]="satis.musteri"
                  required
                  #musteri="ngModel"
                >
                @if (musteri.invalid && (musteri.dirty || musteri.touched)) {
                  <div class="alert alert-danger">
                    Müşteri adı gereklidir
                  </div>
                }
              </div>

              <div class="mb-3">
                <h4>Ürünler</h4>
                @for (detay of satis.satisDetaylari; track $index) {
                  <div class="card mb-2">
                    <div class="card-body">
                      <div class="row">
                        <div class="col-md-3">
                          <label class="form-label">Ürün ID</label>
                          <input
                            type="number"
                            class="form-control"
                            [(ngModel)]="detay.urunId"
                            [name]="'urunId' + $index"
                            required
                          >
                        </div>
                        <div class="col-md-3">
                          <label class="form-label">Miktar</label>
                          <input
                            type="number"
                            class="form-control"
                            [(ngModel)]="detay.miktar"
                            [name]="'miktar' + $index"
                            required
                            min="1"
                          >
                        </div>
                        <div class="col-md-3">
                          <label class="form-label">Birim Fiyat</label>
                          <input
                            type="number"
                            class="form-control"
                            [(ngModel)]="detay.birimFiyat"
                            [name]="'birimFiyat' + $index"
                            required
                            min="0"
                            step="0.01"
                          >
                        </div>
                        <div class="col-md-3 d-flex align-items-end">
                          <button
                            type="button"
                            class="btn btn-danger"
                            (click)="removeProduct($index)"
                          >
                            Ürünü Kaldır
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                }

                <button
                  type="button"
                  class="btn btn-secondary"
                  (click)="addProduct()"
                >
                  Ürün Ekle
                </button>
              </div>

              <div class="d-flex justify-content-between">
                <button
                  type="button"
                  class="btn btn-secondary"
                  routerLink="/satislar"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="!salesForm.form.valid || satis.satisDetaylari.length === 0"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      } @else {
        <div class="alert alert-info">
          Satış bilgileri yükleniyor...
        </div>
      }
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; }
    .card-header { background-color: #f8f9fa; }
  `]
})
export class SalesUpdateComponent implements OnInit {
  satis: Sale | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salesService: SalesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSale(+id);
    }
  }

  private loadSale(id: number): void {
    this.salesService.getSaleById(id).subscribe({
      next: (data) => {
        this.satis = data;
      },
      error: (error) => {
        console.error('Satış bilgileri yüklenirken hata oluştu:', error);
      }
    });
  }

  addProduct(): void {
    if (this.satis) {
      this.satis.satisDetaylari.push({
        id: 0,
        satisId: this.satis.satisID,
        urunId: 0,
        miktar: 1,
        birimFiyat: 0,
        toplamFiyat: 0,
        urunAdi: ''
      });
    }
  }

  removeProduct(index: number): void {
    if (this.satis) {
      this.satis.satisDetaylari.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (!this.satis || this.satis.satisDetaylari.length === 0) {
      alert('En az bir ürün eklemelisiniz');
      return;
    }

    const updateDto: SatisOlustur = {
      musteri: this.satis.musteri,
      detaylar: this.satis.satisDetaylari.map(d => ({
        urunId: d.urunId,
        miktar: d.miktar,
        birimFiyat: d.birimFiyat
      }))
    };

    this.salesService.updateSale(this.satis.satisID, updateDto).subscribe({
      next: () => {
        this.router.navigate(['/satislar']);
      },
      error: (error) => {
        console.error('Satış güncellenirken hata oluştu:', error);
      }
    });
  }
} 