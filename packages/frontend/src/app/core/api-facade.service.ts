import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiFacadeService {
  constructor(private http: HttpClient) {}

  listProblems(): Observable<any[]> {
    return of([]);
  }

  getProblemBySlug(slug: string): Observable<any> {
    return of(null);
  }

  getDueReviews(): Observable<any[]> {
    return of([]);
  }

  rateRecall(id: string, quality: number): Observable<void> {
    return of(void 0);
  }

  getLists(): Observable<any[]> {
    return of([]);
  }

  getList(id: string): Observable<any> {
    return of(null);
  }

  triggerSync(): Observable<void> {
    return of(void 0);
  }
}
