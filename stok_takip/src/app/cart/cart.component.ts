import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesService } from '../services/sales.service';
import { SatisOlustur, SatisDetay } from '../models/satis.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { CariService, Cari } from '../services/cari.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface CartItem {
  urunId: number;
  urunAdi: string;
  miktar: number;
  birimFiyat: number;
  toplamFiyat: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatButtonModule, 
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDividerModule,
    MatRippleModule,
    MatAutocompleteModule
  ],
  template: `
    <div class="cart-container mat-elevation-z4">
      <div class="cart-header">
        <div class="header-content">
          <mat-icon class="cart-icon">shopping_cart</mat-icon>
          <h3>Sepetim</h3>
        </div>
        @if (cartItems.length > 0) {
          <span class="item-count">{{cartItems.length}} Ürün</span>
        }
      </div>

      @if (cartItems.length === 0) {
        <div class="empty-cart">
          <mat-icon class="empty-icon">remove_shopping_cart</mat-icon>
          <p>Sepetiniz boş</p>
          <small>Ürünleri sepete ekleyerek alışverişe başlayabilirsiniz</small>
        </div>
      }

      <div class="cart-items" [class.has-items]="cartItems.length > 0">
        @for (item of cartItems; track item.urunId) {
          <div class="cart-item mat-elevation-z1" matRipple>
            <div class="item-details">
              <div class="item-main">
                <span class="item-name">{{item.urunAdi}}</span>
                <span class="item-price">Birim Fiyat: ₺{{item.birimFiyat | number:'1.2-2'}}</span>
              </div>
              <div class="quantity-controls">
                <button mat-mini-fab color="primary" (click)="decreaseQuantity(item)">
                  <mat-icon>remove</mat-icon>
                </button>
                <mat-form-field class="quantity-input">
                  <input matInput 
                         type="number" 
                         [(ngModel)]="item.miktar" 
                         (ngModelChange)="updateQuantity(item)"
                         min="1"
                         [max]="9999">
                </mat-form-field>
                <button mat-mini-fab color="primary" (click)="increaseQuantity(item)">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
            </div>
            <mat-divider></mat-divider>
            <div class="item-footer">
              <span class="item-total">Toplam: ₺{{item.toplamFiyat | number:'1.2-2'}}</span>
              <button mat-mini-fab class="delete-btn" (click)="removeItem(item)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        }
      </div>

      @if (cartItems.length > 0) {
        <mat-divider class="summary-divider"></mat-divider>
        
        <div class="cart-summary">
          <div class="summary-row total">
            <span class="total-label">Toplam Tutar</span>
            <span class="total-amount">₺{{getTotal() | number:'1.2-2'}}</span>
          </div>
        </div>

        <div class="customer-info">
          <mat-form-field appearance="outline" class="full-width customer-input">
            <mat-label>Müşteri Adı</mat-label>
            <input matInput
                   [formControl]="customerControl"
                   [matAutocomplete]="auto"
                   placeholder="Müşteri adını giriniz veya seçiniz"
                   class="customer-name-input">
            <mat-autocomplete #auto="matAutocomplete">
              <mat-option *ngFor="let cari of filteredCariler | async" [value]="cari.unvan">
                {{cari.unvan}}
              </mat-option>
            </mat-autocomplete>
            <mat-icon matSuffix>person</mat-icon>
          </mat-form-field>
        </div>

        <div class="cart-actions">
          <button mat-raised-button color="warn" (click)="clearCart()">
            <mat-icon>remove_shopping_cart</mat-icon>
            Sepeti Temizle
          </button>
        </div>

        <button 
          mat-raised-button 
          color="primary"
          class="make-sale-btn" 
          [disabled]="!canMakeSale()" 
          (click)="makeSale()">
          <mat-icon>point_of_sale</mat-icon>
          Satışı Tamamla
        </button>
      }
    </div>
  `,
  styles: [`
    .cart-container {
      padding: 24px;
      background-color: white;
      border-radius: 16px;
      max-width: 400px;
      margin: 0 auto;
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .cart-icon {
      color: #1976d2;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .cart-header h3 {
      margin: 0;
      font-size: 1.5rem;
      color: #1f1f1f;
      font-weight: 500;
    }

    .item-count {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .empty-cart {
      text-align: center;
      padding: 48px 0;
      color: #666;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      color: #1976d2;
      opacity: 0.5;
    }

    .empty-cart p {
      font-size: 1.2rem;
      margin: 8px 0;
      color: #333;
    }

    .empty-cart small {
      color: #666;
    }

    .cart-items {
      margin: 20px 0;
      max-height: 400px;
      overflow-y: auto;
      padding-right: 8px;
    }

    .cart-items.has-items {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cart-item {
      background-color: #fff;
      border-radius: 12px;
      padding: 16px;
      transition: transform 0.2s ease;
    }

    .cart-item:hover {
      transform: translateX(4px);
    }

    .item-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .item-main {
      flex: 1;
    }

    .item-name {
      display: block;
      font-weight: 500;
      color: #1f1f1f;
      margin-bottom: 4px;
    }

    .item-price {
      color: #666;
      font-size: 0.9rem;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .quantity-input {
      width: 60px;
      margin: 0 8px;
    }

    .quantity-input input {
      text-align: center;
      font-size: 1.1rem;
      font-weight: 500;
    }

    /* Input spinbutton'ları gizle */
    .quantity-input input::-webkit-outer-spin-button,
    .quantity-input input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .quantity-input input[type=number] {
      -moz-appearance: textfield;
    }

    /* Form field görünümünü basitleştir */
    .quantity-input .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    .quantity-input .mat-mdc-text-field-wrapper {
      padding: 0 8px;
      background-color: transparent;
    }

    .quantity-input .mat-mdc-form-field-flex {
      padding: 0;
      height: 36px;
      align-items: center;
    }

    .quantity-input .mdc-line-ripple {
      display: none;
    }

    .item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      padding: 0 8px;
    }

    .item-total {
      font-weight: 500;
      color: #1976d2;
    }

    .summary-divider {
      margin: 24px 0;
    }

    .cart-summary {
      background-color: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .total-label {
      font-size: 1.2rem;
      font-weight: 500;
      color: #1f1f1f;
    }

    .total-amount {
      font-size: 1.4rem;
      font-weight: 600;
      color: #1976d2;
    }

    .customer-info {
      margin: 24px 0;
    }

    .customer-input {
      width: 100%;
    }

    .customer-input .mat-mdc-text-field-wrapper {
      background-color: #f8f9fa;
    }

    .customer-name-input {
      color: #000000 !important;
      font-size: 1.1rem !important;
      font-weight: 500 !important;
      font-family: 'Roboto', sans-serif !important;
    }

    /* Input placeholder stilini özelleştir */
    .customer-name-input::placeholder {
      color: #757575;
      font-weight: 400;
    }

    /* Label stilini özelleştir */
    .customer-input .mat-mdc-floating-label {
      color: #212121;
      font-weight: 500;
    }

    /* Odaklandığında label rengini ayarla */
    .customer-input.mat-focused .mat-mdc-floating-label {
      color: #1976d2;
    }

    /* Icon stilini özelleştir */
    .customer-input .mat-icon {
      color: #212121;
    }

    .make-sale-btn {
      width: 100%;
      padding: 12px;
      font-size: 1.1rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-transform: uppercase;
      font-weight: 500;
    }

    .make-sale-btn[disabled] {
      opacity: 0.7;
    }

    /* Scrollbar Styling */
    .cart-items::-webkit-scrollbar {
      width: 6px;
    }

    .cart-items::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    .cart-items::-webkit-scrollbar-thumb {
      background: #1976d2;
      border-radius: 3px;
    }

    .cart-items::-webkit-scrollbar-thumb:hover {
      background: #1565c0;
    }

    /* Material Button Overrides */
    .mat-mdc-mini-fab {
      --mdc-fab-container-shape: 8px;
    }

    .delete-btn {
      background-color: #212121;
      color: white;
      transition: all 0.3s ease;
      width: 36px;
      height: 36px;
      line-height: 36px;
    }

    .delete-btn:hover {
      background-color: #000000;
      transform: scale(1.1);
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .delete-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      line-height: 20px;
    }

    .cart-actions {
      margin: 1rem 0;
      display: flex;
      justify-content: flex-end;
      
      button {
        margin-left: 1rem;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  customerControl = new FormControl('');
  cariler: Cari[] = [];
  filteredCariler: Observable<Cari[]>;

  constructor(
    private salesService: SalesService,
    private snackBar: MatSnackBar,
    private cariService: CariService
  ) {
    this.filteredCariler = this.customerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  ngOnInit() {
    this.loadCartFromStorage();
    this.loadCariler();
  }

  private loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    }
  }

  private saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  addToCart(urunId: number, urunAdi: string, birimFiyat: number) {
    const existingItem = this.cartItems.find(item => item.urunId === urunId);
    
    if (existingItem) {
      existingItem.miktar++;
      existingItem.toplamFiyat = existingItem.miktar * existingItem.birimFiyat;
    } else {
      this.cartItems.push({
        urunId,
        urunAdi,
        birimFiyat,
        miktar: 1,
        toplamFiyat: birimFiyat
      });
    }
    
    this.saveCartToStorage();
  }

  increaseQuantity(item: CartItem) {
    item.miktar++;
    item.toplamFiyat = item.miktar * item.birimFiyat;
    this.saveCartToStorage();
  }

  decreaseQuantity(item: CartItem) {
    if (item.miktar > 1) {
      item.miktar--;
      item.toplamFiyat = item.miktar * item.birimFiyat;
      this.saveCartToStorage();
    }
  }

  removeItem(item: CartItem) {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.saveCartToStorage();
    }
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.toplamFiyat, 0);
  }

  canMakeSale(): boolean {
    const customerValue = this.customerControl.value;
    return this.cartItems.length > 0 && customerValue !== null && customerValue.trim().length > 0;
  }

  makeSale() {
    const customerValue = this.customerControl.value;
    if (!customerValue || !customerValue.trim()) {
      this.showError('Müşteri adı zorunludur');
      return;
    }

    const saleDetails = this.cartItems.map(item => ({
      urunId: item.urunId,
      miktar: item.miktar,
      birimFiyat: item.birimFiyat
    }));

    const saleData: SatisOlustur = {
      musteri: customerValue.trim(),
      detaylar: saleDetails
    };

    this.salesService.createSale(saleData).subscribe({
      next: (response) => {
        // Satış başarılı olduktan sonra cari kontrolü yap
        this.checkAndCreateCariMovement(response);
      },
      error: (error) => {
        console.error('Satış oluşturulurken hata:', error);
        this.showError('Satış oluşturulurken bir hata oluştu');
      }
    });
  }

  private checkAndCreateCariMovement(sale: any) {
    console.log('Satış verisi:', sale);
    
    if (!this.customerControl.value) {
      console.log('Müşteri adı boş, cari hareket oluşturulmayacak');
      return;
    }

    // Müşteri adına göre cari hesap ara
    this.cariService.searchCariler(this.customerControl.value).subscribe({
      next: (cariler) => {
        console.log('Bulunan cariler:', cariler);
        
        if (cariler && cariler.length > 0) {
          // İlk eşleşen cari hesabı kullan
          const cari = cariler[0];
          console.log('Seçilen cari hesap:', cari);
          
          // Cari hareket oluştur
          const cariHareket = {
            cariID: cari.cariID,
            islemTuru: "Borc",
            tutar: this.getTotal(),
            belgeNo: sale.satisID?.toString() || '',
            aciklama: `Satış No: ${sale.satisID} - Otomatik oluşturuldu`,
            islemTarihi: new Date(),
            vadeTarihi: new Date()
          };

          console.log('Oluşturulacak cari hareket:', cariHareket);

          // Cari hareketi kaydet
          this.cariService.createCariHareket(cariHareket).subscribe({
            next: (response) => {
              console.log('Cari hareket başarıyla oluşturuldu:', response);
              this.showSuccess('Satış ve cari hareket başarıyla kaydedildi');
              
              // Sepeti temizle
              this.cartItems = [];
              this.customerControl.reset();
              this.saveCartToStorage();
            },
            error: (error) => {
              console.error('Cari hareket oluşturulurken hata:', error);
              let errorMessage = 'Satış yapıldı fakat cari hareket oluşturulamadı';
              
              if (error.error?.message) {
                errorMessage = error.error.message;
              } else if (error.error) {
                errorMessage = error.error;
              } else if (error.message) {
                errorMessage = error.message;
              }
              
              this.showError(errorMessage);
            }
          });
        } else {
          console.log('Bu müşteri adına cari hesap bulunamadı:', this.customerControl.value);
          this.showError(`"${this.customerControl.value}" adına kayıtlı cari hesap bulunamadı`);
        }
      },
      error: (error) => {
        console.error('Cari arama hatası:', error);
        this.showError('Cari hesap araması sırasında bir hata oluştu');
      }
    });
  }

  updateQuantity(item: CartItem) {
    // Minimum miktar kontrolü
    if (item.miktar < 1) {
      item.miktar = 1;
    }
    // Maximum miktar kontrolü
    if (item.miktar > 9999) {
      item.miktar = 9999;
    }
    
    // Toplam fiyatı güncelle
    item.toplamFiyat = item.miktar * item.birimFiyat;
    this.saveCartToStorage();
  }

  showError(message: string) {
    this.snackBar.open(message, 'Tamam', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  showSuccess(message: string) {
    this.snackBar.open(message, 'Tamam', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  private loadCariler() {
    this.cariService.getCariler().subscribe({
      next: (data) => {
        this.cariler = data;
      },
      error: (error) => {
        console.error('Cariler yüklenirken hata:', error);
      }
    });
  }

  private _filter(value: string): Cari[] {
    const filterValue = value.toLowerCase();
    return this.cariler.filter(cari => 
      cari.unvan.toLowerCase().includes(filterValue)
    );
  }

  clearCart(): void {
    // Kullanıcıya onay sor
    if (confirm('Sepetteki tüm ürünleri silmek istediğinizden emin misiniz?')) {
      // Sepeti temizle
      this.cartItems = [];
      // Local storage'ı güncelle
      this.saveCartToStorage();
      // Başarılı mesajı göster
      this.showSuccess('Sepet başarıyla temizlendi');
    }
  }
} 