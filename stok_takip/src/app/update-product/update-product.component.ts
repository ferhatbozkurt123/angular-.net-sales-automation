import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UpdateProductComponent implements OnInit {
  products: Product[] = [];
  searchQuery: string = '';
  selectedProduct: Product | null = null;

  ngOnInit(): void {
    // Ürünleri mock veri olarak tanımlama
    this.products = [
      { id: 1, name: 'Laptop', price: 15000, stock: 10, category: 'Elektronik', image: 'assets/laptop.jpg' },
      { id: 2, name: 'Tablet', price: 5000, stock: 15, category: 'Elektronik', image: 'assets/tablet.jpg' },
      { id: 3, name: 'Defter', price: 20, stock: 100, category: 'Kırtasiye', image: 'assets/defter.jpg' },
      { id: 4, name: 'Silikon', price: 10, stock: 50, category: 'Gıda', image: 'assets/silikon.jpg' }
    ];
  }

  searchProducts(): Product[] {
    if (!this.searchQuery.trim()) {
      return this.products;
    }
    return this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectProduct(productId: number): void {
    this.selectedProduct = this.products.find(product => product.id === productId) || null;
  }

  updateProduct(): void {
    if (this.selectedProduct) {
      const index = this.products.findIndex(product => product.id === this.selectedProduct?.id);
      if (index !== -1) {
        this.products[index] = { ...this.selectedProduct };
        alert('Ürün başarıyla güncellendi!');
        this.selectedProduct = null;
      }
    }
  }
}
