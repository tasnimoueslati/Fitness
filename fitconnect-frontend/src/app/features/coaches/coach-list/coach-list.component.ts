import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoachService } from '../../../core/services/coach.service';
import { Coach } from '../../../core/models/coach.model';

@Component({
  selector: 'app-coach-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <h1>Nos coachs sportifs</h1>
      <p class="subtitle">Trouvez le coach adapté à vos objectifs</p>

      @if (loading) {
        <p>Chargement...</p>
      } @else if (coaches.length === 0) {
        <p>Aucun coach disponible pour le moment.</p>
      } @else {
        <div class="grid grid-3">
          @for (coach of coaches; track coach.id) {
            <a [routerLink]="['/coaches', coach.id]" class="card coach-card">
              <div class="avatar">{{ coach.user.firstName.charAt(0) }}{{ coach.user.lastName.charAt(0) }}</div>
              <h3>{{ coach.user.firstName }} {{ coach.user.lastName }}</h3>
              <div class="specialites">
                @for (s of coach.specialites; track s) {
                  <span class="badge badge-success">{{ s }}</span>
                }
              </div>
              <p class="bio">{{ coach.bio || 'Coach passionné, prêt à vous accompagner.' }}</p>
              <div class="footer-row">
                <span class="note">⭐ {{ coach.noteMoyenne || 'N/A' }} ({{ coach.nombreAvis }} avis)</span>
                @if (coach.tarifSeance) {
                  <span class="tarif">{{ coach.tarifSeance }} TND / séance</span>
                }
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 4px; }
    .subtitle { color: #777; margin-bottom: 24px; }
    .coach-card { display: block; transition: 0.2s; }
    .coach-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
    .avatar {
      width: 56px; height: 56px; border-radius: 50%;
      background: var(--primary); color: #fff; display: flex;
      align-items: center; justify-content: center; font-weight: 700; margin-bottom: 12px;
    }
    h3 { margin: 0 0 8px; }
    .specialites { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
    .bio { font-size: 13px; color: #666; min-height: 36px; }
    .footer-row { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-size: 13px; }
    .tarif { font-weight: 600; color: var(--primary); }
  `]
})
export class CoachListComponent implements OnInit {
  coaches: Coach[] = [];
  loading = true;

  constructor(private coachService: CoachService) {}

  ngOnInit(): void {
    this.coachService.getAll().subscribe({
      next: (data) => { this.coaches = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
