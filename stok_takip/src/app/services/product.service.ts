import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Product {
  urunID: number;
  urunAdi: string;
  aciklama: string | null;
  fiyat: number;
  stokMiktari: number;
  kategoriID: number | null;
  urunGorseli: string | null;
  ozellikler: string | null;
  olusturulmaTarihi: Date;
  guncellemeTarihi: Date;
}

export interface Category {
  kategoriID: number;
  kategoriAdi: string;
  aciklama?: string;
}

export interface CreateProductDto {
  urunAdi: string;
  aciklama: string | null;
  fiyat: number;
  stokMiktari: number;
  kategoriID: number | null;
  ozellikler: string | null;
  urunGorseli?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:7294/api';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error Details:', error);
    let errorMessage = 'Bir hata oluştu';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `İstemci Hatası: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 404) {
        errorMessage = 'API endpoint bulunamadı. Lütfen API servisinin çalıştığından emin olun.';
      } else if (error.status === 400) {
        errorMessage = `Geçersiz İstek: ${error.error?.message || error.message || JSON.stringify(error.error)}`;
      } else {
        errorMessage = `Hata Kodu: ${error.status}\nMesaj: ${error.error?.message || error.message}`;
      }
    }
    return throwError(() => errorMessage);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/Urunler`)
      .pipe(catchError(this.handleError));
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/Urunler/${id}`)
      .pipe(catchError(this.handleError));
  }

  addProduct(product: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/Urunler`, product)
      .pipe(catchError(this.handleError));
  }

  updateProduct(id: number, product: CreateProductDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Urunler/${id}`, {
      urunID: id,
      ...product
    })
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Urunler/${id}`)
      .pipe(catchError(this.handleError));
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/Kategoriler`)
      .pipe(catchError(this.handleError));
  }

  getProductImageUrl(imageName: string | null): string {
    if (!imageName) {
      return 'https://dummyimage.com/400x300/e0e0e0/ffffff&text=Görsel+Yok';
    }

    // ImgBB linklerini doğrudan kullan
    if (imageName.includes('i.ibb.co')) {
      return imageName;
    }

    // Google Drive paylaşım linkini kontrol et
    if (imageName.includes('drive.google.com')) {
      let fileId = '';
      
      if (imageName.includes('/file/d/')) {
        fileId = imageName.split('/file/d/')[1]?.split('/')[0];
      } else if (imageName.includes('id=')) {
        fileId = imageName.split('id=')[1]?.split('&')[0];
      }
      
      if (fileId) {
        // ImgBB'ye yüklemeniz önerilir
        return 'https://dummyimage.com/400x300/e0e0e0/ffffff&text=Google+Drive+Görsel+Yüklenemedi';
      }
    }

    return imageName;
  }

  // Google Drive paylaşım linkini düzenleyen yardımcı metod
  formatGoogleDriveLink(shareLink: string): string {
    if (!shareLink) return '';
    
    // ImgBB linklerini doğrudan kullan
    if (shareLink.includes('i.ibb.co')) {
      return shareLink;
    }
    
    // Google Drive paylaşım linkini kontrol et
    if (shareLink.includes('drive.google.com')) {
      // Google Drive kullanımı önerilmez
      console.warn('Google Drive yerine ImgBB kullanmanız önerilir.');
      return shareLink;
    }
    return shareLink;
  }
}