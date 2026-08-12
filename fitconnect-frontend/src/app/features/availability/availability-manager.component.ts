import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CoachService } from '../../core/services/coach.service';
import { NutritionistService } from '../../core/services/nutritionist.service';
import { Availability, Coach, Nutritionist } from '../../core/models/coach.model';

@Component({
  selector: 'app-availability-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="container">
      <section class="head">
        <div>
          <p class="kicker">{{ isCoach ? 'Coach' : 'Nutritionniste' }}</p>
          <h1>Gestion des créneaux</h1>
          <p>Ajoutez, consultez ou supprimez vos disponibilités visibles par les clients.</p>
        </div>
        <a routerLink="/espace" class="btn btn-outline">Retour espace</a>
      </section>

      @if (errorMessage) {
        <p class="alert error">{{ errorMessage }}</p>
      }
      @if (successMessage) {
        <p class="alert success">{{ successMessage }}</p>
      }

      <section class="grid grid-2">
        <form class="card" (ngSubmit)="addSlot()">
          <h2>Nouveau créneau</h2>
          <label>Date</label>
          <input type="date" [(ngModel)]="form.date" name="date" required>

          <label>Heure début</label>
          <input type="time" [(ngModel)]="form.heureDebut" name="heureDebut" required>

          <label>Heure fin</label>
          <input type="time" [(ngModel)]="form.heureFin" name="heureFin" required>

          <button class="btn btn-primary full" type="submit" [disabled]="saving || !profile">
            {{ saving ? 'Enregistrement...' : 'Ajouter le créneau' }}
          </button>
        </form>

        <section class="card">
          <h2>Profil lié</h2>
          @if (profile) {
            <div class="profile-line">
              <strong>{{ profile.user.firstName }} {{ profile.user.lastName }}</strong>
              <span>{{ profile.specialites.join(', ') || 'Spécialités à compléter' }}</span>
            </div>
            <p class="muted">
              ID {{ isCoach ? 'coach' : 'nutritionniste' }}: {{ profile.id }}.
              Les créneaux ajoutés seront reliés à ce profil.
            </p>
          } @else if (loading) {
            <p class="muted">Chargement du profil...</p>
          } @else {
            <p class="muted">Aucun profil professionnel trouvé pour ce compte.</p>
          }
        </section>
      </section>

      <section class="card slots-card">
        <div class="slots-head">
          <h2>Mes créneaux disponibles</h2>
          <span>{{ slots.length }} créneau(x)</span>
        </div>

        @if (loading) {
          <p class="muted">Chargement des créneaux...</p>
        } @else if (slots.length === 0) {
          <p class="muted">Aucun créneau disponible pour le moment.</p>
        } @else {
          <div class="slot-list">
            @for (slot of slots; track slot.id) {
              <div class="slot-row">
                <div>
                  <strong>{{ slot.date }}</strong>
                  <span>{{ slot.heureDebut }} - {{ slot.heureFin }}</span>
                </div>
                <b [class.reserved]="slot.reserve">{{ slot.reserve ? 'Réservé' : 'Disponible' }}</b>
                <button class="btn btn-danger" type="button" (click)="deleteSlot(slot)" [disabled]="deletingId === slot.id">
                  {{ deletingId === slot.id ? 'Suppression...' : 'Supprimer' }}
                </button>
              </div>
            }
          </div>
        }
      </section>
    </main>
  `,
  styles: [`
    .head {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      align-items: end;
      margin-bottom: 20px;
      padding: 28px;
      border-radius: 8px;
      color: #fff;
      background: linear-gradient(100deg, rgba(20,20,22,.96), rgba(20,20,22,.72)),
        url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80') center/cover;
      border-bottom: 5px solid var(--primary);
    }
    .kicker { color: var(--primary); text-transform: uppercase; letter-spacing: 3px; font-size: 12px; font-weight: 900; margin: 0 0 8px; }
    h1 { margin: 0 0 8px; font-size: clamp(34px, 5vw, 56px); text-transform: uppercase; line-height: 1; }
    .head p { margin: 0; color: #e5e5e5; }
    h2 { margin: 0 0 16px; }
    .full { width: 100%; }
    .alert { padding: 12px 14px; border-radius: 8px; font-size: 14px; }
    .alert.error { background: #ffebee; color: var(--danger); }
    .alert.success { background: #e8f5e9; color: var(--success); }
    .profile-line { display: grid; gap: 8px; }
    .profile-line span, .muted { color: #777; line-height: 1.55; }
    .slots-card { margin-top: 20px; }
    .slots-head { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 10px; }
    .slots-head span { color: var(--primary); font-weight: 900; }
    .slot-list { display: grid; gap: 10px; }
    .slot-row {
      display: grid;
      grid-template-columns: 1fr auto auto;
      align-items: center;
      gap: 14px;
      padding: 14px;
      border: 1px solid #eee;
      border-radius: 8px;
    }
    .slot-row span { display: block; color: #666; margin-top: 4px; }
    .slot-row b { color: #2e7d32; font-size: 12px; text-transform: uppercase; }
    .slot-row b.reserved { color: #f9a825; }
    @media (max-width: 760px) {
      .head, .slots-head { display: block; }
      .head .btn { margin-top: 18px; }
      .slot-row { grid-template-columns: 1fr; }
    }
  `]
})
export class AvailabilityManagerComponent implements OnInit {
  profile: Coach | Nutritionist | null = null;
  slots: Availability[] = [];
  loading = true;
  saving = false;
  deletingId: number | null = null;
  errorMessage = '';
  successMessage = '';
  form = {
    date: new Date().toISOString().slice(0, 10),
    heureDebut: '09:00',
    heureFin: '10:00'
  };

  constructor(
    public auth: AuthService,
    private coachService: CoachService,
    private nutritionistService: NutritionistService
  ) {}

  get isCoach(): boolean {
    return this.auth.hasRole('COACH');
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  addSlot(): void {
    if (!this.profile) return;

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: Availability = {
      date: this.form.date,
      heureDebut: this.form.heureDebut,
      heureFin: this.form.heureFin,
      reserve: false
    };

    const save$ = this.isCoach
      ? this.coachService.addAvailability(this.profile.id, request)
      : this.nutritionistService.addAvailability(this.profile.id, request);

    save$.subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Créneau ajouté avec succès.';
        this.loadSlots();
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || "Impossible d'ajouter le créneau.";
      }
    });
  }

  deleteSlot(slot: Availability): void {
    if (!slot.id) return;

    this.deletingId = slot.id;
    this.errorMessage = '';
    this.successMessage = '';

    const delete$ = this.isCoach
      ? this.coachService.deleteAvailability(slot.id)
      : this.nutritionistService.deleteAvailability(slot.id);

    delete$.subscribe({
      next: () => {
        this.deletingId = null;
        this.successMessage = 'Créneau supprimé.';
        this.loadSlots();
      },
      error: (err) => {
        this.deletingId = null;
        this.errorMessage = err?.error?.message || 'Impossible de supprimer ce créneau.';
      }
    });
  }

  private loadProfile(): void {
    this.loading = true;

    if (this.isCoach) {
      this.coachService.getMyProfile().subscribe({
        next: (profile: Coach) => {
          this.profile = profile;
          this.loadSlots();
        },
        error: (err: any) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Impossible de charger le profil coach.';
        }
      });
      return;
    }

    this.nutritionistService.getMyProfile().subscribe({
      next: (profile: Nutritionist) => {
        this.profile = profile;
        this.loadSlots();
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Impossible de charger le profil nutritionniste.';
      }
    });
  }

  private loadSlots(): void {
    if (!this.profile) return;

    const slots$ = this.isCoach
      ? this.coachService.getAvailability(this.profile.id)
      : this.nutritionistService.getAvailability(this.profile.id);

    slots$.subscribe({
      next: (slots) => {
        this.slots = slots;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Impossible de charger les créneaux.';
      }
    });
  }
}
