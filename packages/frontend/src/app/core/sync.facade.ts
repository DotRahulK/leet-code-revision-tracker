import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { SyncResult } from './models';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class SyncFacade {
  loading = signal(false);

  constructor(private http: HttpClient, private toast: ToastService) {}

  syncRecent(params: { username?: string; limit?: number } = {}): Observable<SyncResult> {
    this.loading.set(true);
    return this.http.post<SyncResult>('/api/leetcode/sync', params).pipe(
      catchError(err => {
        this.toast.error('Sync failed');
        return throwError(() => err);
      }),
      finalize(() => this.loading.set(false))
    );
  }
}
