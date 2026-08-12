import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CoachService } from '../../../core/services/coach.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { Availability, Coach } from '../../../core/models/coach.model';

@Component({
  selector: 'app-coach-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (coach) {
      <div class="container">
        <div class="header card">
          <div class="avatar">{{ coach.user.firstName.charAt(0) }}{{ coach.user.lastName.charAt(0) }}</div>
          <div>
            <h1>{{ coach.user.firstName }} {{ coach.user.lastName }}</h1>
            <div class="specialites">
              @for (s of coach.specialites; track s) {
                <span class="badge badge-success">{{ s }}</span>
              }
            </div>
            <p>{{ coach.bio }}</p>
            <p class="note">⭐ {{ coach.noteMoyenne }} ({{ coach.nombreAvis }} avis)
              @if (coach.tarifSeance) { · <strong>{{ coach.tarifSeance }} TND / séance</strong> }
            </p>
          </div>
        </div>

        <div class="card">
          <h2>Créneaux disponibles</h2>
          @if (slots.length === 0) {
            <p>Aucun créneau disponible pour le moment.</p>
          } @else {
            <div class="slots">
              @for (slot of slots; track slot.id) {
                <button class="slot" [class.selected]="selectedSlot === slot" (click)="selectSlot(slot)">
                  {{ slot.date }} · {{ slot.heureDebut }} - {{ slot.heureFin }}
                </button>
              }
            </div>
          }

          @if (selectedSlot) {
            <div class="confirm-box">
              @if (bookingError) { <p class="error">{{ bookingError }}</p> }
              @if (bookingSuccess) { <p class="success">Réservation envoyée avec succès !</p> }
              <button class="btn btn-primary" (click)="book()" [disabled]="booking">
                {{ booking ? 'Réservation...' : 'Confirmer la réservation' }}
              </button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .header { display: flex; gap: 20px; margin-bottom: 20px; }
    .avatar {
      width: 80px; height: 80px; border-radius: 50%; flex-shrink: 0;
      background: var(--primary); color: #fff; display: flex;
      align-items: center; justify-content: center; font-weight: 700; font-size: 24px;
    }
    .specialites { display: flex; gap: 6px; margin: 8px 0; flex-wrap: wrap; }
    .note { font-size: 14px; color: #555; }
    h2 { margin-top: 0; }
    .slots { display: flex; flex-wrap: wrap; gap: 10px; }
    .slot {
      padding: 10px 14px; border-radius: 10px; border: 1px solid #ddd;
      background: #fff; font-size: 13px;
    }
    .slot.selected { background: var(--primary); color: #fff; border-color: var(--primary); }
    .confirm-box { margin-top: 20px; }
    .error { color: var(--danger); }
    .success { color: var(--success); }
  `]
})
export class CoachDetailComponent implements OnInit {
  coach: Coach | null = null;
  slots: Availability[] = [];
  selectedSlot: Availability | null = null;
  booking = false;
  bookingError = '';
  bookingSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coachService: CoachService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.coachService.getById(id).subscribe((c) => (this.coach = c));
    this.coachService.getAvailability(id).subscribe((s) => (this.slots = s));
  }

  selectSlot(slot: Availability): void {
    this.selectedSlot = slot;
    this.bookingSuccess = false;
    this.bookingError = '';
  }

  book(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    if (!this.selectedSlot || !this.coach) return;

    this.booking = true;
    this.bookingService.create({
      coachId: this.coach.id,
      date: this.selectedSlot.date,
      heureDebut: this.selectedSlot.heureDebut,
      heureFin: this.selectedSlot.heureFin
    }).subscribe({
      next: () => { this.booking = false; this.bookingSuccess = true; },
      error: (err) => { this.booking = false; this.bookingError = err?.error?.message || 'Erreur lors de la réservation'; }
    });
  }
}
