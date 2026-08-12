import { User } from './user.model';

export interface Availability {
  id?: number;
  date: string;
  heureDebut: string;
  heureFin: string;
  reserve?: boolean;
}

export interface Coach {
  id: number;
  user: User;
  specialites: string[];
  bio?: string;
  diplomes?: string;
  tarifSeance?: number;
  noteMoyenne: number;
  nombreAvis: number;
  disponibilites?: Availability[];
}

export interface Nutritionist {
  id: number;
  user: User;
  specialites: string[];
  bio?: string;
  diplomes?: string;
  tarifConsultation?: number;
  noteMoyenne: number;
  nombreAvis: number;
  disponibilites?: Availability[];
}
