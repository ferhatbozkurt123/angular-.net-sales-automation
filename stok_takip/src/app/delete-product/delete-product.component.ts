import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DeleteProductComponent implements OnInit {
  products: Product[] = [];
  searchQuery: string = '';
  selectedProductId: number | null = null;

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
    this.selectedProductId = productId;
  }

  deleteSelectedProduct(): void {
    if (this.selectedProductId !== null) {
      this.products = this.products.filter(product => product.id !== this.selectedProductId);
      this.selectedProductId = null;
    }
  }
}
