import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, finalize, map, throwError } from 'rxjs';
import { UiReview } from './models';
import { apiReviewToUi } from './mappers/review.mapper';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class ReviewsFacade {
  loading = signal(false);

  constructor(private http: HttpClient, private toast: ToastService) {}

  getDueReviews(): Observable<UiReview[]> {
    this.loading.set(true);
    return this.http.get<any[]>('/reviews/today').pipe(
      map(arr => arr.map(apiReviewToUi)),
      catchError(err => {
        this.toast.error('Failed to load reviews');
        return throwError(() => err);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  rateRecall(id: string, quality: number): Observable<void> {
    return this.http.post<void>(`/reviews/${id}`, { quality }).pipe(
      catchError(err => {
        this.toast.error('Failed to rate review');
        return throwError(() => err);
      })
    );
  }

  updateNotes(id: string, notes: string): Observable<void> {
    return this.http.patch<void>(`/user-problems/${id}/notes`, { notes }).pipe(
      catchError(err => {
        this.toast.error('Failed to save notes');
        return throwError(() => err);
      })
    );
  }

  updateCode(id: string, code: string): Observable<void> {
    return this.http.patch<void>(`/user-problems/${id}/code`, { code }).pipe(
      catchError(err => {
        this.toast.error('Failed to save code');
        return throwError(() => err);
      })
    );
  }
}
