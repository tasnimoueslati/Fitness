export type NotificationType =
  | 'RESERVATION_CONFIRMEE'
  | 'RESERVATION_ANNULEE'
  | 'RESERVATION_RAPPEL'
  | 'COMMANDE_CONFIRMEE'
  | 'NOUVEAU_MESSAGE'
  | 'PROMOTION';

export interface AppNotification {
  id: number;
  type: NotificationType;
  message: string;
  lu: boolean;
  createdAt: string;
}
