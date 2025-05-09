import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Cari {
  cariID: number;
  unvan: string;
  tip: string;
  vergiDairesi?: string;
  vergiNo?: string;
  telefon?: string;
  email?: string;
  adres?: string;
  bakiye: number;
  olusturulmaTarihi: Date;
  guncellemeTarihi: Date;
}

export interface CariHareket {
  hareketID?: number;
  cariID: number;
  islemTarihi?: Date;
  islemTuru: string;
  tutar: number;
  aciklama?: string;
  belgeNo?: string;
  vadeTarihi?: Date;
}

export interface CariCreateDto {
  unvan: string;
  tip: string;
  vergiDairesi?: string;
  vergiNo?: string;
  telefon?: string;
  email?: string;
  adres?: string;
}

export interface CariHareketCreateDto {
  cariID: number;
  islemTuru: string;
  tutar: number;
  aciklama?: string;
  belgeNo?: string;
  vadeTarihi?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CariService {
  private apiUrl = 'http://localhost:7294/api';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'Bir hata oluştu';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `İstemci Hatası: ${error.error.message}`;
    } else {
      if (error.status === 400) {
        errorMessage = `Geçersiz İstek: ${error.error?.message || error.error || JSON.stringify(error)}`;
      } else if (error.status === 404) {
        errorMessage = 'İstek yapılan kaynak bulunamadı';
      } else {
        errorMessage = `Sunucu Hatası: ${error.error?.message || error.message}`;
      }
    }
    
    return throwError(() => errorMessage);
  }

  // Cari İşlemleri
  getCariler(): Observable<Cari[]> {
    return this.http.get<Cari[]>(`${this.apiUrl}/Cariler`).pipe(
      tap(response => console.log('Cariler response:', response)),
      catchError(this.handleError)
    );
  }

  getCariById(id: number): Observable<Cari> {
    return this.http.get<Cari>(`${this.apiUrl}/Cariler/${id}`).pipe(
      tap(response => console.log('Cari by ID response:', response)),
      catchError(this.handleError)
    );
  }

  createCari(cari: CariCreateDto): Observable<Cari> {
    return this.http.post<Cari>(`${this.apiUrl}/Cariler`, cari);
  }

  updateCari(id: number, cari: CariCreateDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Cariler/${id}`, cari);
  }

  deleteCari(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Cariler/${id}`);
  }

  searchCariler(unvan: string): Observable<Cari[]> {
    return this.http.get<Cari[]>(`${this.apiUrl}/Cariler/search/${unvan}`).pipe(
      tap(response => console.log('Search cariler response:', response)),
      catchError(this.handleError)
    );
  }

  getCarilerByTip(tip: string): Observable<Cari[]> {
    return this.http.get<Cari[]>(`${this.apiUrl}/Cariler/tip/${tip}`);
  }

  getCariBakiye(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/Cariler/${id}/bakiye`);
  }

  // Cari Hareket İşlemleri
  getCariHareketler(): Observable<CariHareket[]> {
    return this.http.get<CariHareket[]>(`${this.apiUrl}/CariHareketler`);
  }

  getCariHareketById(id: number): Observable<CariHareket> {
    return this.http.get<CariHareket>(`${this.apiUrl}/CariHareketler/${id}`);
  }

  getCariHareketlerByCariId(cariId: number): Observable<CariHareket[]> {
    return this.http.get<CariHareket[]>(`${this.apiUrl}/CariHareketler/cari/${cariId}`).pipe(
      tap(response => console.log('Get cari hareketler response:', response)),
      catchError(this.handleError)
    );
  }

  createCariHareket(hareket: CariHareketCreateDto): Observable<CariHareket> {
    console.log('Creating cari hareket with data:', hareket);
    return this.http.post<CariHareket>(`${this.apiUrl}/CariHareketler`, hareket).pipe(
      tap(response => console.log('Create cari hareket response:', response)),
      catchError(this.handleError)
    );
  }

  deleteCariHareket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/CariHareketler/${id}`);
  }

  getCariHareketlerByDateRange(cariId: number, startDate: Date, endDate: Date): Observable<CariHareket[]> {
    return this.http.get<CariHareket[]>(`${this.apiUrl}/CariHareketler/cari/${cariId}/tarih`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  }

  getCariHareketlerByIslemTuru(cariId: number, islemTuru: string): Observable<CariHareket[]> {
    return this.http.get<CariHareket[]>(`${this.apiUrl}/CariHareketler/cari/${cariId}/islemturu/${islemTuru}`);
  }

  getToplamTutar(cariId: number, islemTuru: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/CariHareketler/cari/${cariId}/toplam/${islemTuru}`);
  }
} 