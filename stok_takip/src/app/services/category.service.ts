import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Category {
  kategoriID: number;
  kategoriAdi: string;
  aciklama: string;
  olusturulmaTarihi: Date;
  guncellemeTarihi: Date;
}

export interface CreateCategoryDto {
  kategoriAdi: string;
  aciklama: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:7294/api/Kategoriler';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Client side error:', error.error.message);
    } else {
      console.error('Backend returned code:', error.status);
      console.error('Body was:', error.error);
    }
    return throwError(() => error);
  }

  createCategory(category: CreateCategoryDto): Observable<Category> {
    const categoryToCreate = {
      kategoriAdi: category.kategoriAdi,
      aciklama: category.aciklama
    };
    
    console.log('Gönderilen veri:', categoryToCreate);
    return this.http.post<Category>(this.apiUrl, categoryToCreate)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }
} 