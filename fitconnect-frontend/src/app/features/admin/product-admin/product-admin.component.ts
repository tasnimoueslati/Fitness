import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Category, Product, ProductRequest } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header-row">
        <h1>Produits et stock</h1>
        <button class="btn btn-primary" (click)="openCreate()">+ Ajouter un produit</button>
      </div>

      @if (errorMessage) {
        <div class="alert alert-error">{{ errorMessage }}</div>
      }
      @if (successMessage) {
        <div class="alert alert-success">{{ successMessage }}</div>
      }

      @if (showForm) {
        <div class="card form-card">
          <h2>{{ editingId ? 'Modifier le produit' : 'Nouveau produit' }}</h2>
          <form (ngSubmit)="save()" #productForm="ngForm">
            <div class="field">
              <label>Nom *</label>
              <input type="text" name="nom" [(ngModel)]="form.nom" required />
            </div>
            <div class="field">
              <label>Description</label>
              <textarea name="description" [(ngModel)]="form.description" rows="3"></textarea>
            </div>
            <div class="field-row">
              <div class="field">
                <label>Prix (TND) *</label>
                <input type="number" name="prix" [(ngModel)]="form.prix" required min="0" step="0.01" />
              </div>
              <div class="field">
                <label>Stock *</label>
                <input type="number" name="stock" [(ngModel)]="form.stock" required min="0" step="1" />
              </div>
              <div class="field">
                <label>Promotion (%)</label>
                <input type="number" name="promotionPourcentage" [(ngModel)]="form.promotionPourcentage" min="0" max="100" step="1" />
              </div>
            </div>
            <div class="field">
              <label>URL de l'image</label>
              <input type="text" name="imageUrl" [(ngModel)]="form.imageUrl" placeholder="https://..." />
            </div>
            <div class="field">
              <label>Catégorie</label>
              <select name="categoryId" [(ngModel)]="form.categoryId">
                <option [ngValue]="undefined">— Aucune —</option>
                @for (cat of categories; track cat.id) {
                  <option [ngValue]="cat.id">{{ cat.nom }}</option>
                }
              </select>
            </div>
            <div class="actions">
              <button type="submit" class="btn btn-primary" [disabled]="!productForm.valid || saving">
                {{ saving ? 'Enregistrement...' : (editingId ? 'Mettre à jour' : 'Créer le produit') }}
              </button>
              <button type="button" class="btn btn-outline" (click)="cancelForm()">Annuler</button>
            </div>
          </form>
        </div>
      }

      <div class="card">
        @if (loading) {
          <p>Chargement des produits...</p>
        } @else if (products.length === 0) {
          <p>Aucun produit pour le moment.</p>
        } @else {
          <table class="product-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Promo</th>
                <th>Stock</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (p of products; track p.id) {
                <tr>
                  <td>
                    @if (p.imageUrl) {
                      <img [src]="p.imageUrl" [alt]="p.nom" class="thumb" />
                    } @else {
                      <span class="thumb placeholder"></span>
                    }
                  </td>
                  <td>{{ p.nom }}</td>
                  <td>{{ p.category?.nom || '—' }}</td>
                  <td>{{ p.prix }} TND</td>
                  <td>{{ p.promotionPourcentage ? p.promotionPourcentage + '%' : '—' }}</td>
                  <td [class.low-stock]="p.stock <= 5">{{ p.stock }}</td>
                  <td>
                    <span class="badge" [class.badge-off]="!p.actif">{{ p.actif ? 'Actif' : 'Inactif' }}</span>
                  </td>
                  <td class="row-actions">
                    <button class="btn btn-small btn-outline" (click)="openEdit(p)">Modifier</button>
                    <button class="btn btn-small btn-danger" (click)="remove(p)">Supprimer</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  `,
  styles: [`
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
    h1 { margin: 0; }
    .card { background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,.06); margin-bottom: 20px; }
    .form-card { border-left: 4px solid var(--primary, #ff4612); }
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
    .field-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    label { font-weight: 700; font-size: 13px; color: #333; }
    input, textarea, select {
      padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; font-family: inherit;
    }
    .actions { display: flex; gap: 12px; margin-top: 10px; }
    .btn { padding: 10px 18px; border-radius: 6px; border: none; cursor: pointer; font-weight: 700; font-size: 14px; }
    .btn-primary { background: var(--primary, #ff4612); color: #fff; }
    .btn-primary:disabled { opacity: .5; cursor: not-allowed; }
    .btn-outline { background: #fff; border: 1px solid #ccc; color: #333; }
    .btn-danger { background: #fff; border: 1px solid #d33; color: #d33; }
    .btn-small { padding: 6px 12px; font-size: 12px; }
    .alert { padding: 12px 16px; border-radius: 6px; margin-bottom: 16px; font-weight: 600; }
    .alert-error { background: #fdecea; color: #b71c1c; }
    .alert-success { background: #e8f5e9; color: #1b5e20; }
    .product-table { width: 100%; border-collapse: collapse; }
    .product-table th, .product-table td { text-align: left; padding: 10px 8px; border-bottom: 1px solid #eee; font-size: 14px; }
    .product-table th { color: #777; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; }
    .thumb { width: 44px; height: 44px; object-fit: cover; border-radius: 6px; }
    .thumb.placeholder { display: inline-block; background: #eee; }
    .low-stock { color: #d33; font-weight: 800; }
    .badge { padding: 3px 10px; border-radius: 12px; background: #e8f5e9; color: #1b5e20; font-size: 12px; font-weight: 700; }
    .badge-off { background: #f0f0f0; color: #777; }
    .row-actions { display: flex; gap: 8px; }
    @media (max-width: 700px) {
      .field-row { grid-template-columns: 1fr; }
      .product-table { display: block; overflow-x: auto; }
    }
  `]
})
export class ProductAdminComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  saving = false;
  showForm = false;
  editingId: number | null = null;
  errorMessage = '';
  successMessage = '';

  form: ProductRequest = this.emptyForm();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  emptyForm(): ProductRequest {
    return {
      nom: '',
      description: '',
      prix: 0,
      promotionPourcentage: 0,
      stock: 0,
      imageUrl: '',
      categoryId: undefined
    };
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les produits.';
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: () => {}
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.form = this.emptyForm();
    this.showForm = true;
    this.clearMessages();
  }

  openEdit(product: Product): void {
    this.editingId = product.id;
    this.form = {
      nom: product.nom,
      description: product.description || '',
      prix: product.prix,
      promotionPourcentage: product.promotionPourcentage || 0,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
      categoryId: product.category?.id
    };
    this.showForm = true;
    this.clearMessages();
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.form = this.emptyForm();
  }

  save(): void {
    this.saving = true;
    this.clearMessages();
    const request$ = this.editingId
      ? this.productService.update(this.editingId, this.form)
      : this.productService.create(this.form);

    request$.subscribe({
      next: () => {
        this.successMessage = this.editingId ? 'Produit mis à jour avec succès.' : 'Produit créé avec succès.';
        this.saving = false;
        this.showForm = false;
        this.editingId = null;
        this.form = this.emptyForm();
        this.loadProducts();
      },
      error: () => {
        this.errorMessage = "Une erreur est survenue lors de l'enregistrement du produit.";
        this.saving = false;
      }
    });
  }

  remove(product: Product): void {
    if (!confirm(`Supprimer "${product.nom}" ? Cette action est irréversible.`)) {
      return;
    }
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.successMessage = 'Produit supprimé.';
        this.loadProducts();
      },
      error: () => {
        this.errorMessage = 'Impossible de supprimer ce produit.';
      }
    });
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}