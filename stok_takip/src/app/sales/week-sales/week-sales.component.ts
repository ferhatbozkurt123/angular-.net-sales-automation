import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Sale {
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

@Component({
  selector: 'app-week-sales',
  templateUrl: './week-sales.component.html',
  styleUrls: ['./week-sales.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class WeekSalesComponent implements OnInit {
  sales: Sale[] = [
    {
      productName: 'Laptop',
      quantity: 2,
      price: 15000,
      total: 30000
    },
    {
      productName: 'Mouse',
      quantity: 5,
      price: 250,
      total: 1250
    },
    {
      productName: 'Klavye',
      quantity: 3,
      price: 500,
      total: 1500
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Burada API'den veri çekilebilir
    this.calculateTotals();
  }

  private calculateTotals(): void {
    this.sales = this.sales.map(sale => ({
      ...sale,
      total: sale.quantity * sale.price
    }));
  }
}