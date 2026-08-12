import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Category, Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="shop">
      <section class="shop-hero">
        <div>
          <p class="kicker">FitConnect Store</p>
          <h1>Marketplace sportive</h1>
          <p>Compléments, accessoires, vêtements et équipements recommandés selon vos objectifs.</p>
        </div>
        <div class="deal">
          <span>Offre semaine</span>
          <strong>-25%</strong>
          <p>Sur la nutrition sportive et les packs débutants</p>
        </div>
      </section>

      <section class="toolbar">
        <input [(ngModel)]="search" (ngModelChange)="onFilterChange()" placeholder="Rechercher whey, gants, tapis...">
        <select [(ngModel)]="categoryId" (ngModelChange)="onFilterChange()">
          <option [ngValue]="null">Toutes les catégories</option>
          @for (c of categories; track c.id) {
            <option [ngValue]="c.id">{{ c.nom }}</option>
          }
        </select>
        <select [(ngModel)]="sort">
          <option value="recommended">Recommandés</option>
          <option value="priceAsc">Prix croissant</option>
          <option value="priceDesc">Prix décroissant</option>
          <option value="promo">Promotions</option>
          <option value="rating">Meilleures notes</option>
        </select>
      </section>

      <section class="category-row">
        <button class="chip" [class.active]="categoryId === null" (click)="selectCategory(null)">Tout</button>
        @for (c of categories; track c.id) {
          <button class="chip" [class.active]="categoryId === c.id" (click)="selectCategory(c.id)">{{ c.nom }}</button>
        }
      </section>

      @if (loading) {
        <p class="state">Chargement du catalogue...</p>
      } @else if (errorMessage) {
        <p class="state error-state">{{ errorMessage }}</p>
      } @else if (sortedProducts.length === 0) {
        <p class="state">Aucun produit trouvé dans la base de données.</p>
      } @else {
        <section class="catalog">
          <aside class="sidebar">
            <h2>Pourquoi acheter ici ?</h2>
            <p>Les produits peuvent être recommandés par un coach, un nutritionniste ou l'assistant IA Groq.</p>
            <div class="side-item"><strong>Livraison</strong><span>24-72h</span></div>
            <div class="side-item"><strong>Paiement</strong><span>Sécurisé</span></div>
            <div class="side-item"><strong>Objectifs</strong><span>Perte de poids, masse, forme</span></div>
          </aside>

          <div class="product-grid">
            @for (p of sortedProducts; track p.id) {
              <article class="product-card">
                <a [routerLink]="['/boutique', p.id]" class="image-wrap">
                  <img [src]="p.imageUrl || placeholderImg" [alt]="p.nom">
                  @if (p.promotionPourcentage > 0) {
                    <span class="promo">-{{ p.promotionPourcentage }}%</span>
                  }
                </a>
                <div class="product-body">
                  <span class="category">{{ p.category?.nom || 'FitConnect' }}</span>
                  <a [routerLink]="['/boutique', p.id]"><h3>{{ p.nom }}</h3></a>
                  <p class="desc">{{ p.description || 'Produit disponible dans la marketplace FitConnect.' }}</p>
                  <div class="rating">
                    <span>★ {{ p.noteMoyenne || '4.6' }}</span>
                    <small>{{ p.nombreAvis || 18 }} avis</small>
                  </div>
                  <div class="buy-row">
                    <div>
                      @if (p.promotionPourcentage > 0) {
                        <span class="old-price">{{ p.prix }} TND</span>
                      }
                      <strong class="price">{{ finalPrice(p) | number:'1.2-2' }} TND</strong>
                    </div>
                    <span class="stock" [class.empty]="p.stock === 0">
                      {{ p.stock === 0 ? 'Rupture' : p.stock + ' en stock' }}
                    </span>
                  </div>
                  <button class="btn btn-primary full" (click)="cart.addToCart(p)" [disabled]="p.stock === 0">
                    {{ p.stock === 0 ? 'Indisponible' : 'Ajouter au panier' }}
                  </button>
                </div>
              </article>
            }
          </div>
        </section>
      }
    </main>
  `,
  styles: [`
    .shop { padding: 28px clamp(16px, 5vw, 70px) 70px; }
    .shop-hero {
      min-height: 320px;
      border-radius: 8px;
      padding: clamp(28px, 5vw, 54px);
      display: grid;
      grid-template-columns: 1fr 260px;
      align-items: end;
      gap: 28px;
      color: #fff;
      background:
        linear-gradient(90deg, rgba(16,16,18,.96), rgba(16,16,18,.66)),
        url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80') center/cover;
      border-bottom: 5px solid var(--primary);
    }
    .kicker { color: var(--primary); text-transform: uppercase; letter-spacing: 3px; font-size: 12px; font-weight: 900; margin: 0 0 12px; }
    h1 { font-size: clamp(40px, 7vw, 82px); line-height: .95; margin: 0; text-transform: uppercase; }
    .shop-hero p { max-width: 650px; color: #e8e8e8; font-size: 18px; line-height: 1.55; }
    .deal {
      background: rgba(255,255,255,.95);
      color: #171719;
      padding: 22px;
      border-radius: 8px;
    }
    .deal span { color: var(--primary); font-weight: 900; text-transform: uppercase; font-size: 12px; }
    .deal strong { display: block; font-size: 54px; line-height: 1; margin: 8px 0; }
    .deal p { color: #4c4c4c; margin: 0; font-size: 14px; }
    .toolbar {
      display: grid;
      grid-template-columns: 1.5fr .8fr .8fr;
      gap: 12px;
      margin: 22px 0 12px;
      background: #fff;
      padding: 14px;
      border-radius: 8px;
      box-shadow: 0 10px 26px rgba(0,0,0,.06);
    }
    .toolbar input, .toolbar select { margin: 0; }
    .category-row { display: flex; gap: 10px; flex-wrap: wrap; margin: 0 0 22px; }
    .chip {
      border: 1px solid #ddd;
      background: #fff;
      border-radius: 8px;
      padding: 10px 14px;
      font-weight: 800;
      color: #333;
    }
    .chip.active, .chip:hover { background: #171719; color: #fff; border-color: #171719; }
    .catalog { display: grid; grid-template-columns: 260px 1fr; gap: 22px; align-items: start; }
    .sidebar {
      background: #171719;
      color: #fff;
      border-radius: 8px;
      padding: 22px;
      position: sticky;
      top: 104px;
    }
    .sidebar h2 { font-size: 22px; margin: 0 0 12px; }
    .sidebar p { color: #cfcfcf; line-height: 1.55; }
    .side-item { display: flex; justify-content: space-between; gap: 12px; padding: 14px 0; border-top: 1px solid rgba(255,255,255,.14); }
    .side-item span { color: var(--primary); text-align: right; }
    .product-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
    .product-card {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 12px 28px rgba(0,0,0,.07);
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .image-wrap { position: relative; background: #eee; display: block; }
    .image-wrap img { display: block; width: 100%; aspect-ratio: 1 / .82; object-fit: cover; }
    .promo {
      position: absolute;
      top: 12px;
      left: 12px;
      background: var(--primary);
      color: #fff;
      font-weight: 900;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
    }
    .product-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
    .category { color: var(--primary); font-size: 12px; font-weight: 900; text-transform: uppercase; }
    h3 { margin: 0; font-size: 18px; line-height: 1.25; }
    .desc { color: #666; font-size: 13px; line-height: 1.45; min-height: 38px; margin: 0; }
    .rating, .buy-row { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
    .rating span { color: #171719; font-weight: 900; }
    .rating small { color: #777; }
    .old-price { display: block; text-decoration: line-through; color: #999; font-size: 13px; }
    .price { color: var(--primary); font-size: 20px; }
    .stock { color: #2e7d32; font-size: 12px; font-weight: 900; }
    .stock.empty { color: var(--danger); }
    .full { width: 100%; margin-top: auto; }
    .state {
      background: #fff;
      padding: 28px;
      border-radius: 8px;
      box-shadow: 0 10px 26px rgba(0,0,0,.06);
    }
    .error-state { color: var(--danger); }
    @media (max-width: 1120px) {
      .catalog { grid-template-columns: 1fr; }
      .sidebar { position: static; }
      .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 760px) {
      .shop-hero, .toolbar { grid-template-columns: 1fr; }
      .product-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  errorMessage = '';
  search = '';
  categoryId: number | null = null;
  sort = 'recommended';
  placeholderImg = 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=700&q=80';

  constructor(private productService: ProductService, public cart: CartService) {}

  get sortedProducts(): Product[] {
    const items = [...this.products];
    if (this.sort === 'priceAsc') return items.sort((a, b) => this.finalPrice(a) - this.finalPrice(b));
    if (this.sort === 'priceDesc') return items.sort((a, b) => this.finalPrice(b) - this.finalPrice(a));
    if (this.sort === 'promo') return items.sort((a, b) => b.promotionPourcentage - a.promotionPourcentage);
    if (this.sort === 'rating') return items.sort((a, b) => (b.noteMoyenne || 0) - (a.noteMoyenne || 0));
    return items;
  }

  ngOnInit(): void {
    this.productService.getCategories().subscribe({
      next: (c) => (this.categories = c),
      error: () => (this.categories = [])
    });
    this.loadProducts();
  }

  selectCategory(id: number | null): void {
    this.categoryId = id;
    this.onFilterChange();
  }

  onFilterChange(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.productService.getAll(this.search || undefined, this.categoryId || undefined).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.products = [];
        this.errorMessage = "Impossible de charger les produits depuis la base de données. Vérifiez que le backend Spring Boot est lancé et que l'endpoint /api/public/products répond.";
        this.loading = false;
      }
    });
  }

  finalPrice(p: Product): number {
    return this.cart.finalPrice(p);
  }

}
