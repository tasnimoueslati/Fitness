import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Mes réservations</h1>

      @if (loading) {
        <p>Chargement...</p>
      } @else if (bookings.length === 0) {
        <p>Vous n'avez pas encore de réservation.</p>
      } @else {
        <div class="list">
          @for (b of bookings; track b.id) {
            <div class="card row">
              <div>
                <h3>
                  @if (b.coach) { Séance coaching avec {{ b.coach.user.firstName }} {{ b.coach.user.lastName }} }
                  @else if (b.nutritionist) { Consultation avec {{ b.nutritionist.user.firstName }} {{ b.nutritionist.user.lastName }} }
                </h3>
                <p>{{ b.date }} · {{ b.heureDebut }} - {{ b.heureFin }}</p>
                @if (b.notes) { <p class="notes">{{ b.notes }}</p> }
              </div>
              <div class="actions">
                <span class="badge" [ngClass]="statusClass(b.statut)">{{ statusLabel(b.statut) }}</span>
                @if (b.statut === 'EN_ATTENTE' || b.statut === 'CONFIRMEE') {
                  <button class="btn btn-danger" (click)="cancel(b)">Annuler</button>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 20px; }
    .list { display: flex; flex-direction: column; gap: 14px; }
    .row { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
    h3 { margin: 0 0 6px; }
    p { margin: 2px 0; font-size: 14px; color: #555; }
    .notes { font-style: italic; color: #888; }
    .actions { display: flex; align-items: center; gap: 12px; }
  `]
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.bookingService.myBookings().subscribe({
      next: (data) => { this.bookings = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  cancel(b: Booking): void {
    this.bookingService.cancel(b.id).subscribe(() => this.load());
  }

  statusLabel(statut: string): string {
    const labels: Record<string, string> = {
      EN_ATTENTE: 'En attente', CONFIRMEE: 'Confirmée', ANNULEE: 'Annulée',
      TERMINEE: 'Terminée', REPORTEE: 'Reportée'
    };
    return labels[statut] || statut;
  }

  statusClass(statut: string): string {
    if (statut === 'CONFIRMEE' || statut === 'TERMINEE') return 'badge-success';
    if (statut === 'ANNULEE') return 'badge-danger';
    return 'badge-warning';
  }
}
