import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Tedarik {
  tedarikID: number;
  urunID: number;
  urunAdi: string;
  tedarikciAdi: string;
  tedarikMiktari: number;
  birimFiyat: number;
  tedarikTarihi: Date;
  aciklama?: string;
}

export interface TedarikCreateDto {
  urunID: number;
  tedarikciAdi: string;
  tedarikMiktari: number;
  birimFiyat: number;
  tedarikTarihi?: Date;
  aciklama?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TedarikService {
  private apiUrl = 'http://localhost:7294/api/Tedarikler';

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

  getTedarikler(): Observable<Tedarik[]> {
    return this.http.get<Tedarik[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getTedarik(id: number): Observable<Tedarik> {
    return this.http.get<Tedarik>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createTedarik(tedarik: TedarikCreateDto): Observable<Tedarik> {
    return this.http.post<Tedarik>(this.apiUrl, tedarik)
      .pipe(catchError(this.handleError));
  }

  updateTedarik(id: number, tedarik: TedarikCreateDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, tedarik)
      .pipe(catchError(this.handleError));
  }

  deleteTedarik(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getTedariklerByUrun(urunId: number): Observable<Tedarik[]> {
    return this.http.get<Tedarik[]>(`${this.apiUrl}/urun/${urunId}`)
      .pipe(catchError(this.handleError));
  }

  getTedariklerByTedarikci(tedarikci: string): Observable<Tedarik[]> {
    return this.http.get<Tedarik[]>(`${this.apiUrl}/tedarikci/${tedarikci}`)
      .pipe(catchError(this.handleError));
  }
} 