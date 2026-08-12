import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Tableau de bord</h1>

      @if (stats) {
        <div class="grid grid-3">
          <div class="card stat">
            <span class="label">Utilisateurs</span>
            <span class="value">{{ stats['nombreUtilisateurs'] }}</span>
          </div>
          <div class="card stat">
            <span class="label">Clients</span>
            <span class="value">{{ stats['nombreClients'] }}</span>
          </div>
          <div class="card stat">
            <span class="label">Coachs</span>
            <span class="value">{{ stats['nombreCoachs'] }}</span>
          </div>
          <div class="card stat">
            <span class="label">Commandes</span>
            <span class="value">{{ stats['nombreCommandes'] }}</span>
          </div>
          <div class="card stat">
            <span class="label">Chiffre d'affaires</span>
            <span class="value">{{ stats['chiffreAffaires'] }} TND</span>
          </div>
          <div class="card stat">
            <span class="label">Réservations du jour</span>
            <span class="value">{{ stats['reservationsDuJour'] }}</span>
          </div>
        </div>

        <div class="card">
          <h2>Produits les plus vendus</h2>
          @if (stats['produitsPlusVendus']?.length) {
            <ul>
              @for (p of stats['produitsPlusVendus']; track p.id) {
                <li>{{ p.nom }} — {{ p.nombreAvis }} avis</li>
              }
            </ul>
          } @else {
            <p>Pas encore de données.</p>
          }
        </div>
      } @else {
        <p>Chargement des statistiques...</p>
      }
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 20px; }
    .stat { display: flex; flex-direction: column; gap: 6px; }
    .label { font-size: 13px; color: #888; }
    .value { font-size: 26px; font-weight: 700; color: var(--primary); }
    h2 { margin-top: 0; }
    ul { padding-left: 18px; }
    li { padding: 4px 0; font-size: 14px; }
  `]
})
export class DashboardComponent implements OnInit {
  stats: Record<string, any> | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe((data) => (this.stats = data));
  }
}
