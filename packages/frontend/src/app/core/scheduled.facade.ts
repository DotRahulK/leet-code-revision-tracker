import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, finalize, map, throwError } from 'rxjs';
import { UiScheduledItem } from './models';
import { apiScheduledItemToUi } from './mappers/scheduled-item.mapper';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class ScheduledFacade {
  loading = signal(false);

  constructor(private http: HttpClient, private toast: ToastService) {}

  getScheduled(): Observable<UiScheduledItem[]> {
    this.loading.set(true);
    return this.http.get<any>('/api/scheduled').pipe(
      map(res => (res.items ?? []).map(apiScheduledItemToUi)),
      catchError(err => {
        this.toast.error('Failed to load scheduled items');
        return throwError(() => err);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  scheduleProblem(problemId: string): Observable<any> {
    return this.http.post(`/api/scheduled/problem/${problemId}`, {}).pipe(
      catchError(err => {
        this.toast.error('Failed to schedule problem');
        return throwError(() => err);
      })
    );
  }
}
