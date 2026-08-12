import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppNotification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private baseUrl = `${environment.apiUrl}/notifications`;

  notifications = signal<AppNotification[]>([]);
  unreadCount = signal<number>(0);

  constructor(private http: HttpClient) {}

  loadMine() {
    return this.http.get<AppNotification[]>(`${this.baseUrl}/me`).pipe(
      tap((list) => {
        this.notifications.set(list);
        this.unreadCount.set(list.filter((n) => !n.lu).length);
      })
    );
  }

  markAsRead(id: number) {
    return this.http.patch<AppNotification>(`${this.baseUrl}/${id}/lue`, {}).pipe(
      tap(() => {
        this.notifications.update((list) =>
          list.map((n) => (n.id === id ? { ...n, lu: true } : n))
        );
        this.unreadCount.update((c) => Math.max(0, c - 1));
      })
    );
  }
}
