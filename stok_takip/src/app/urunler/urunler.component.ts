import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ReportComponent } from '../report/report.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { CartComponent } from '../cart/cart.component';
import { ProductService, Product } from '../services/product.service';
import { Router } from '@angular/router';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule, Routes } from '@angular/router';
import { CategoryAddComponent } from '../category-add/category-add.component';

interface CartItem {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

interface Category {
  kategoriID: number;
  kategoriAdi: string;
}

@Component({
  selector: 'app-urunler',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    RouterModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    CartComponent,
    ReportComponent,
    ProductFormComponent,
    CategoryAddComponent
  ],
  templateUrl: './urunler.component.html',
  styleUrls: ['./urunler.component.scss']
})
export class UrunlerComponent implements OnInit {
  @ViewChild(CartComponent) cartComponent!: CartComponent;

  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  error: string | null = null;
  searchTerm: string = '';
  categories: Category[] = [];
  selectedCategory: number | null = null;

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Ürünler yüklenirken bir hata oluştu: ' + error;
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.products];
    
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.urunAdi.toLowerCase().includes(searchLower)
      );
    }
    
    if (this.selectedCategory) {
      filtered = filtered.filter(product => 
        product.kategoriID === this.selectedCategory
      );
    }
    
    this.filteredProducts = filtered;
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onCategoryChange(event: any): void {
    this.selectedCategory = event.value;
    this.applyFilters();
  }

  addToCart(product: Product): void {
    if (!product.urunID || !product.fiyat) {
      console.error('Ürün ID veya fiyat bilgisi eksik');
      return;
    }

    this.cartComponent.addToCart(
      product.urunID,
      product.urunAdi,
      product.fiyat
    );
  }

 

  openSalesPopup(): void {
    this.router.navigate(['/satislar']);
  }




  editProduct(product: Product): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '800px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.products.findIndex(p => p.urunID === result.urunID);
        if (index !== -1) {
          this.products[index] = result;
          this.applyFilters();
        }
      }
    });
  }

  deleteProduct(id: number | undefined): void {
    if (id === undefined) return;
    
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(product => product.urunID !== id);
          this.applyFilters();
        },
        error: (error) => {
          this.error = 'Ürün silinirken bir hata oluştu: ' + error;
        }
      });
    }
  }

  handleImageError(event: any): void {
    const img = event.target;
    img.src = 'https://dummyimage.com/400x300/e0e0e0/ffffff&text=Görsel+Yok';
    img.onerror = null;
  }
}
