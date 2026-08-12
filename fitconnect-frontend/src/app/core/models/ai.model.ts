export interface TrainingProgramRequest {
  age?: number;
  poidsKg?: number;
  tailleCm?: number;
  niveau?: string;
  objectif?: string;
}

export interface NutritionPlanRequest {
  age?: number;
  poidsKg?: number;
  tailleCm?: number;
  objectif?: string;
  restrictionsAlimentaires?: string;
  besoinCaloriqueEstime?: number;
}

export interface ChatRequest {
  message: string;
}

export interface AiResponse {
  content: string;
}
