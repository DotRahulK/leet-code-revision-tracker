import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import { UiProblem } from './models';
import { apiProblemToUi } from './mappers/problem.mapper';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class ProblemsFacade {
  loading = signal(false);

  constructor(private http: HttpClient, private toast: ToastService) {}

  list(params: Record<string, any> = {}): Observable<UiProblem[]> {
    this.loading.set(true);
    return this.http.get<any[]>('/problems', { params }).pipe(
      map(arr => arr.map(apiProblemToUi)),
      catchError(err => {
        this.toast.error('Failed to load problems');
        return throwError(() => err);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  getBySlug(slug: string): Observable<UiProblem> {
    this.loading.set(true);
    return this.http.get<any>(`/problems/${slug}`).pipe(
      map(apiProblemToUi),
      catchError(err => {
        this.toast.error('Problem not found');
        return throwError(() => err);
      }),
      finalize(() => this.loading.set(false))
    );
  }
}
