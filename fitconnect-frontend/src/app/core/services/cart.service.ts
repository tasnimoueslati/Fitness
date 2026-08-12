import { Injectable, computed, signal } from '@angular/core';
import { CartItem, Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>(this.loadFromStorage());

  cartItems = computed(() => this.items());
  totalItems = computed(() => this.items().reduce((sum, i) => sum + i.quantite, 0));
  totalPrice = computed(() =>
    this.items().reduce((sum, i) => sum + this.finalPrice(i.product) * i.quantite, 0)
  );

  finalPrice(product: Product): number {
    const promo = product.promotionPourcentage || 0;
    return promo > 0 ? product.prix * (1 - promo / 100) : product.prix;
  }

  addToCart(product: Product, quantite = 1): void {
    if (product.stock <= 0) return;

    const requestedQuantity = this.normalizeQuantity(quantite, product.stock);
    const current = [...this.items()];
    const existing = current.find((i) => i.product.id === product.id);
    if (existing) {
      existing.product = product;
      existing.quantite = this.normalizeQuantity(existing.quantite + requestedQuantity, product.stock);
    } else {
      current.push({ product, quantite: requestedQuantity });
    }
    this.items.set(current);
    this.persist();
  }

  updateQuantity(productId: number, quantite: number): void {
    const current = this.items()
      .map((i) => (
        i.product.id === productId
          ? { ...i, quantite: this.normalizeQuantity(quantite, i.product.stock) }
          : i
      ))
      .filter((i) => i.quantite > 0);
    this.items.set(current);
    this.persist();
  }

  replaceItems(items: CartItem[]): void {
    this.items.set(items);
    this.persist();
  }

  removeFromCart(productId: number): void {
    this.items.set(this.items().filter((i) => i.product.id !== productId));
    this.persist();
  }

  clear(): void {
    this.items.set([]);
    this.persist();
  }

  private persist(): void {
    localStorage.setItem('fitconnect_cart', JSON.stringify(this.items()));
  }

  private loadFromStorage(): CartItem[] {
    const raw = localStorage.getItem('fitconnect_cart');
    return raw ? JSON.parse(raw) : [];
  }

  private normalizeQuantity(quantite: number, stock: number): number {
    const parsed = Number(quantite);
    if (!Number.isFinite(parsed)) return 1;
    return Math.min(Math.max(Math.floor(parsed), 1), stock);
  }
}
