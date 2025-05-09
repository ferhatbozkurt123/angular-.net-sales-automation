import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddProductComponent {
  newProduct = {
    name: '',
    price: 0,
    stock: 0,
    category: '',
    image: ''
  };

  addProduct(): void {
    if (
      this.newProduct.name.trim() &&
      this.newProduct.price > 0 &&
      this.newProduct.stock >= 0 &&
      this.newProduct.category.trim()
    ) {
      console.log('Yeni Ürün:', this.newProduct);
      alert('Ürün başarıyla eklendi!');
      this.resetForm();
    } else {
      alert('Lütfen tüm alanları doğru şekilde doldurun!');
    }
  }

  resetForm(): void {
    this.newProduct = {
      name: '',
      price: 0,
      stock: 0,
      category: '',
      image: ''
    };
  }
}
