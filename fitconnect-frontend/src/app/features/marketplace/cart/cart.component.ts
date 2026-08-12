import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { CartItem } from '../../../core/models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <h1>Mon panier</h1>

      @if (cart.cartItems().length === 0) {
        <p>Votre panier est vide. <a routerLink="/boutique">Découvrir la boutique</a></p>
      } @else {
        @if (cartWarning) {
          <p class="warning">{{ cartWarning }}</p>
        }

        <div class="cart-list">
          @for (item of cart.cartItems(); track item.product.id) {
            <div class="card cart-row">
              <div class="img" [style.backgroundImage]="'url(' + (item.product.imageUrl || placeholderImg) + ')'"></div>
              <div class="info">
                <h3>{{ item.product.nom }}</h3>
                <p class="price">{{ cart.finalPrice(item.product) | number:'1.2-2' }} TND</p>
                <p class="stock">{{ item.product.stock }} en stock</p>
              </div>
              <input type="number" min="1" [max]="item.product.stock"
                     [ngModel]="item.quantite"
                     (ngModelChange)="cart.updateQuantity(item.product.id, $event)">
              <button class="btn btn-danger" (click)="cart.removeFromCart(item.product.id)">Retirer</button>
            </div>
          }
        </div>

        <div class="card summary">
          <div class="total-row">
            <span>Total</span>
            <strong>{{ cart.totalPrice() | number:'1.2-2' }} TND</strong>
          </div>

          @if (auth.isAuthenticated()) {
            <input [(ngModel)]="adresseLivraison" placeholder="Adresse de livraison">
            @if (orderError) { <p class="error">{{ orderError }}</p> }
            @if (orderSuccess) { <p class="success">Commande passée avec succès !</p> }
            <button class="btn btn-primary full" (click)="checkout()" [disabled]="ordering || validating">
              {{ ordering || validating ? 'Traitement...' : 'Passer la commande' }}
            </button>
          } @else {
            <p>Connectez-vous pour finaliser votre commande.</p>
            <a routerLink="/auth/login" class="btn btn-primary full">Se connecter</a>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 20px; }
    .cart-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
    .cart-row { display: flex; align-items: center; gap: 16px; }
    .img { width: 70px; height: 70px; border-radius: 8px; background-size: cover; background-position: center; background-color: #f0f0f0; flex-shrink: 0; }
    .info { flex: 1; }
    h3 { margin: 0 0 4px; font-size: 15px; }
    .price { color: var(--primary); font-weight: 600; margin: 0; }
    .stock { margin: 4px 0 0; color: #777; font-size: 12px; }
    input[type=number] { width: 70px; margin: 0; }
    .summary { max-width: 400px; }
    .total-row { display: flex; justify-content: space-between; font-size: 18px; margin-bottom: 16px; }
    .full { width: 100%; margin-top: 8px; }
    .error { color: var(--danger); font-size: 13px; }
    .warning { color: #8a5a00; background: #fff8e1; padding: 12px 14px; border-radius: 8px; font-size: 13px; }
    .success { color: var(--success); font-size: 13px; }
    @media (max-width: 640px) {
      .cart-row { align-items: flex-start; flex-wrap: wrap; }
      .info { min-width: 180px; }
    }
  `]
})
export class CartComponent implements OnInit {
  adresseLivraison = '';
  ordering = false;
  validating = false;
  orderError = '';
  cartWarning = '';
  orderSuccess = false;
  placeholderImg = 'https://placehold.co/100x100?text=FC';

  constructor(
    public cart: CartService,
    private orderService: OrderService,
    private productService: ProductService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.validateCart().subscribe();
  }

  checkout(): void {
    if (this.cart.cartItems().length === 0) return;

    this.ordering = true;
    this.orderError = '';

    this.validateCart().subscribe((isValid) => {
      if (!isValid) {
        this.ordering = false;
        this.orderError = 'Votre panier a été mis à jour avec les données de la base. Vérifiez-le puis relancez la commande.';
        return;
      }

      const items = this.cart.cartItems().map((i) => ({ productId: i.product.id, quantite: i.quantite }));

      this.orderService.create({ items, adresseLivraison: this.adresseLivraison }).subscribe({
        next: () => {
          this.ordering = false;
          this.orderSuccess = true;
          this.cart.clear();
          setTimeout(() => this.router.navigate(['/commandes']), 1200);
        },
        error: (err) => {
          this.ordering = false;
          this.orderError = err?.error?.message || 'Erreur lors de la commande. Vérifiez votre connexion, votre session et le stock des produits.';
        }
      });
    });
  }

  private validateCart(): Observable<boolean> {
    const items = this.cart.cartItems();
    this.cartWarning = '';

    if (items.length === 0) return of(true);

    this.validating = true;
    const checks = items.map((item) =>
      this.productService.getById(item.product.id).pipe(
        map((product) => {
          if (product.stock <= 0 || product.actif === false) return null;
          return {
            product,
            quantite: Math.min(item.quantite, product.stock)
          } as CartItem;
        }),
        catchError(() => of(null))
      )
    );

    return forkJoin(checks).pipe(
      map((validatedItems) => {
        const cleanItems = validatedItems.filter((item): item is CartItem => item !== null);
        const changed = cleanItems.length !== items.length || cleanItems.some((item, index) => {
          const previous = items[index];
          return !previous || previous.quantite !== item.quantite || previous.product.stock !== item.product.stock;
        });

        if (changed) {
          this.cart.replaceItems(cleanItems);
          this.cartWarning = 'Certains produits du panier ont été supprimés ou ajustés car ils ne correspondent plus à la base de données.';
        }

        this.validating = false;
        return !changed;
      }),
      catchError(() => {
        this.validating = false;
        this.orderError = 'Impossible de vérifier le panier auprès du backend.';
        return of(false);
      })
    );
  }
}
