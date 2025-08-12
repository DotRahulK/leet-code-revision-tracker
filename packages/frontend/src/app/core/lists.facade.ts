import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, finalize, map, throwError } from 'rxjs';
import { UiList } from './models';
import { apiListToUi } from './mappers/list.mapper';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class ListsFacade {
  loading = signal(false);

  constructor(private http: HttpClient, private toast: ToastService) {}

  getLists(): Observable<UiList[]> {
    this.loading.set(true);
    return this.http.get<any[]>('/api/lists/custom').pipe(
      map(arr => arr.map(apiListToUi)),
      catchError(err => {
        this.toast.error('Failed to load lists');
        return throwError(() => err);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  getList(id: string): Observable<UiList> {
    this.loading.set(true);
    return this.http.get<any>(`/api/lists/custom/${id}`).pipe(
      map(apiListToUi),
      catchError(err => {
        this.toast.error('Failed to load list');
        return throwError(() => err);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  importList(list: string): Observable<UiList> {
    return this.http.post<any>('/api/leetcode/list', { list }).pipe(
      map(apiListToUi),
      catchError(err => {
        this.toast.error('Failed to import list');
        return throwError(() => err);
      })
    );
  }

  createList(name: string): Observable<UiList> {
    return this.http.post<any>('/api/lists/custom', { name }).pipe(
      map(apiListToUi),
      catchError(err => {
        this.toast.error('Failed to create list');
        return throwError(() => err);
      })
    );
  }

  addProblems(listId: string, problemIds: string[]): Observable<any> {
    return this.http.post(`/api/lists/custom/${listId}/items`, { problemIds }).pipe(
      catchError(err => {
        this.toast.error('Failed to add problems');
        return throwError(() => err);
      })
    );
  }

  scheduleList(listId: string): Observable<any> {
    return this.http.post(`/api/lists/custom/${listId}/schedule`, {}).pipe(
      catchError(err => {
        this.toast.error('Failed to schedule list');
        return throwError(() => err);
      })
    );
  }
}
