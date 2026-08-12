export interface TrackingRequest {
  date?: string;
  poidsKg?: number;
  tailleCm?: number;
  tourTailleCm?: number;
  tourHanchesCm?: number;
  pourcentageGraisse?: number;
  objectif?: string;
  notes?: string;
}

export interface TrackingRecord extends TrackingRequest {
  id: number;
  imc?: number;
}
