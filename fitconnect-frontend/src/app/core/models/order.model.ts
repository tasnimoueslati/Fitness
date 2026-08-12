export type OrderStatus = 'EN_ATTENTE' | 'CONFIRMEE' | 'EN_LIVRAISON' | 'LIVREE' | 'ANNULEE';

export interface OrderItemRequest {
  productId: number;
  quantite: number;
}

export interface OrderRequest {
  items: OrderItemRequest[];
  adresseLivraison?: string;
}

export interface OrderItem {
  id: number;
  product: any;
  quantite: number;
  prixUnitaire: number;
}

export interface Order {
  id: number;
  client: any;
  items: OrderItem[];
  total: number;
  statut: OrderStatus;
  adresseLivraison?: string;
  createdAt: string;
}

export interface CartItem {
  product: import('./product.model').Product;
  quantite: number;
}
