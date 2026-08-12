export type BookingStatus = 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE' | 'TERMINEE' | 'REPORTEE';

export interface BookingRequest {
  coachId?: number;
  nutritionistId?: number;
  date: string;
  heureDebut: string;
  heureFin: string;
  notes?: string;
}

export interface Booking {
  id: number;
  client: any;
  coach?: any;
  nutritionist?: any;
  date: string;
  heureDebut: string;
  heureFin: string;
  statut: BookingStatus;
  notes?: string;
  createdAt: string;
}
