import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Notifications</h1>

      @if (notificationService.notifications().length === 0) {
        <p>Aucune notification pour le moment.</p>
      } @else {
        <div class="list">
          @for (n of notificationService.notifications(); track n.id) {
            <div class="card notif" [class.unread]="!n.lu" (click)="markRead(n.id)">
              <p>{{ n.message }}</p>
              <span class="date">{{ n.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 20px; }
    .list { display: flex; flex-direction: column; gap: 10px; }
    .notif { cursor: pointer; }
    .notif.unread { border-left: 4px solid var(--primary); }
    .notif p { margin: 0 0 6px; }
    .date { font-size: 12px; color: #999; }
  `]
})
export class NotificationsComponent implements OnInit {
  constructor(public notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.loadMine().subscribe();
  }

  markRead(id: number): void {
    this.notificationService.markAsRead(id).subscribe();
  }
}
