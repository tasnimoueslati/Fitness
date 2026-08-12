import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    @if (product) {
      <div class="container">
        <div class="detail card">
          <div class="img" [style.backgroundImage]="'url(' + (product.imageUrl || placeholderImg) + ')'"></div>
          <div class="info">
            <h1>{{ product.nom }}</h1>
            <p class="note">⭐ {{ product.noteMoyenne || 'N/A' }} ({{ product.nombreAvis }} avis)</p>
            <p class="desc">{{ product.description }}</p>

            <div class="price-row">
              @if (product.promotionPourcentage > 0) {
                <span class="old-price">{{ product.prix }} TND</span>
                <span class="price">{{ cart.finalPrice(product) | number:'1.2-2' }} TND</span>
                <span class="badge badge-danger">-{{ product.promotionPourcentage }}%</span>
              } @else {
                <span class="price">{{ product.prix }} TND</span>
              }
            </div>

            <p class="stock">{{ product.stock > 0 ? product.stock + ' en stock' : 'Rupture de stock' }}</p>

            <div class="qty-row">
              <input type="number" [(ngModel)]="quantity" min="1" [max]="product.stock">
              <button class="btn btn-primary" (click)="addToCart()" [disabled]="product.stock === 0">
                Ajouter au panier
              </button>
            </div>
            <a routerLink="/panier" class="btn btn-outline">Voir mon panier</a>
          </div>
        </div>

        <div class="card">
          <h2>Avis clients</h2>
          @if (reviews.length === 0) {
            <p>Aucun avis pour le moment.</p>
          } @else {
            @for (r of reviews; track r.id) {
              <div class="review">
                <strong>{{ r.author.firstName }}</strong> — ⭐ {{ r.note }}/5
                @if (r.commentaire) { <p>{{ r.commentaire }}</p> }
              </div>
            }
          }

          @if (auth.isAuthenticated()) {
            <div class="add-review">
              <select [(ngModel)]="newNote">
                <option [ngValue]="5">⭐⭐⭐⭐⭐</option>
                <option [ngValue]="4">⭐⭐⭐⭐</option>
                <option [ngValue]="3">⭐⭐⭐</option>
                <option [ngValue]="2">⭐⭐</option>
                <option [ngValue]="1">⭐</option>
              </select>
              <input [(ngModel)]="newComment" placeholder="Votre commentaire (optionnel)">
              <button class="btn btn-primary" (click)="submitReview()">Publier</button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .detail { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 20px; }
    .img { border-radius: 12px; background-size: cover; background-position: center; min-height: 280px; background-color: #f0f0f0; }
    .note { color: #555; font-size: 14px; }
    .desc { color: #555; line-height: 1.6; }
    .price-row { display: flex; align-items: center; gap: 10px; margin: 16px 0; }
    .price { font-size: 22px; font-weight: 700; color: var(--primary); }
    .old-price { text-decoration: line-through; color: #999; }
    .stock { font-size: 13px; color: #777; margin-bottom: 14px; }
    .qty-row { display: flex; gap: 10px; margin-bottom: 12px; }
    .qty-row input { width: 80px; margin: 0; }
    @media (max-width: 800px) { .detail { grid-template-columns: 1fr; } }
    .review { border-bottom: 1px solid #eee; padding: 10px 0; }
    .add-review { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
    .add-review select { width: auto; margin: 0; }
    .add-review input { flex: 1; margin: 0; min-width: 200px; }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  reviews: Review[] = [];
  quantity = 1;
  newNote = 5;
  newComment = '';
  placeholderImg = 'https://placehold.co/500x400?text=FitConnect';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public cart: CartService,
    private reviewService: ReviewService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(id).subscribe((p) => (this.product = p));
    this.loadReviews(id);
  }

  loadReviews(id: number): void {
    this.reviewService.getFor('PRODUIT', id).subscribe((r) => (this.reviews = r));
  }

  addToCart(): void {
    if (this.product) this.cart.addToCart(this.product, this.quantity);
  }

  submitReview(): void {
    if (!this.product) return;
    this.reviewService.add({
      targetType: 'PRODUIT',
      targetId: this.product.id,
      note: this.newNote,
      commentaire: this.newComment
    }).subscribe(() => {
      this.newComment = '';
      this.loadReviews(this.product!.id);
    });
  }
}
