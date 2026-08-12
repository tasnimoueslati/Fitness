import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Mes commandes</h1>

      @if (loading) {
        <p>Chargement...</p>
      } @else if (orders.length === 0) {
        <p>Vous n'avez pas encore passé de commande.</p>
      } @else {
        <div class="list">
          @for (o of orders; track o.id) {
            <div class="card">
              <div class="row">
                <h3>Commande #{{ o.id }}</h3>
                <span class="badge" [ngClass]="statusClass(o.statut)">{{ statusLabel(o.statut) }}</span>
              </div>
              <p class="date">{{ o.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
              <div class="items">
                @for (item of o.items; track item.id) {
                  <div class="item">
                    <span>{{ item.quantite }} × {{ item.product.nom }}</span>
                    <span>{{ item.prixUnitaire * item.quantite | number:'1.2-2' }} TND</span>
                  </div>
                }
              </div>
              <div class="total-row"><span>Total</span><strong>{{ o.total | number:'1.2-2' }} TND</strong></div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 20px; }
    .list { display: flex; flex-direction: column; gap: 16px; }
    .row { display: flex; justify-content: space-between; align-items: center; }
    h3 { margin: 0; }
    .date { color: #888; font-size: 13px; margin: 4px 0 12px; }
    .items { border-top: 1px solid #eee; padding-top: 10px; }
    .item { display: flex; justify-content: space-between; font-size: 14px; padding: 4px 0; color: #555; }
    .total-row { display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee; }
  `]
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.myOrders().subscribe({
      next: (data) => { this.orders = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  statusLabel(statut: string): string {
    const labels: Record<string, string> = {
      EN_ATTENTE: 'En attente', CONFIRMEE: 'Confirmée', EN_LIVRAISON: 'En livraison',
      LIVREE: 'Livrée', ANNULEE: 'Annulée'
    };
    return labels[statut] || statut;
  }

  statusClass(statut: string): string {
    if (statut === 'LIVREE' || statut === 'CONFIRMEE') return 'badge-success';
    if (statut === 'ANNULEE') return 'badge-danger';
    return 'badge-warning';
  }
}
