// daily-sales.module.ts
import { Component, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  exports: [
    
  ]
})
export class DailySalesModule { }

// daily-sales.component.ts

interface Sale {
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

@Component({
  selector: 'app-daily-sales',
  templateUrl: './daily-sales.component.html',
  styleUrls: ['./daily-sales.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DailySalesComponent implements OnInit {
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