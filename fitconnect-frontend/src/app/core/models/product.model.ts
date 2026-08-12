export interface Category {
  id: number;
  nom: string;
  description?: string;
}

export interface Product {
  id: number;
  nom: string;
  description?: string;
  prix: number;
  promotionPourcentage: number;
  stock: number;
  imageUrl?: string;
  category?: Category;
  noteMoyenne: number;
  nombreAvis: number;
  actif: boolean;
}

export interface ProductRequest {
  nom: string;
  description?: string;
  prix: number;
  promotionPourcentage?: number;
  stock: number;
  imageUrl?: string;
  categoryId?: number;
}

export interface CartItem {
  product: Product;
  quantite: number;
}
