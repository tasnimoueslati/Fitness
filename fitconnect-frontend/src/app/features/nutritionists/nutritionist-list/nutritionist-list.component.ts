import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NutritionistService } from '../../../core/services/nutritionist.service';
import { Nutritionist } from '../../../core/models/coach.model';

@Component({
  selector: 'app-nutritionist-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <h1>Nos nutritionnistes</h1>
      <p class="subtitle">Un suivi nutritionnel personnalisé pour atteindre vos objectifs</p>

      @if (loading) {
        <p>Chargement...</p>
      } @else if (nutritionists.length === 0) {
        <p>Aucun nutritionniste disponible pour le moment.</p>
      } @else {
        <div class="grid grid-3">
          @for (n of nutritionists; track n.id) {
            <a [routerLink]="['/nutritionnistes', n.id]" class="card n-card">
              <div class="avatar">{{ n.user.firstName.charAt(0) }}{{ n.user.lastName.charAt(0) }}</div>
              <h3>{{ n.user.firstName }} {{ n.user.lastName }}</h3>
              <div class="specialites">
                @for (s of n.specialites; track s) {
                  <span class="badge badge-success">{{ s }}</span>
                }
              </div>
              <p class="bio">{{ n.bio || 'Nutritionniste diplômé(e), à votre écoute.' }}</p>
              <div class="footer-row">
                <span class="note">⭐ {{ n.noteMoyenne || 'N/A' }} ({{ n.nombreAvis }} avis)</span>
                @if (n.tarifConsultation) {
                  <span class="tarif">{{ n.tarifConsultation }} TND / consultation</span>
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
    .n-card { display: block; transition: 0.2s; }
    .n-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
    .avatar {
      width: 56px; height: 56px; border-radius: 50%;
      background: var(--secondary); color: #fff; display: flex;
      align-items: center; justify-content: center; font-weight: 700; margin-bottom: 12px;
    }
    h3 { margin: 0 0 8px; }
    .specialites { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
    .bio { font-size: 13px; color: #666; min-height: 36px; }
    .footer-row { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-size: 13px; }
    .tarif { font-weight: 600; color: var(--primary); }
  `]
})
export class NutritionistListComponent implements OnInit {
  nutritionists: Nutritionist[] = [];
  loading = true;

  constructor(private service: NutritionistService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (data) => { this.nutritionists = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
