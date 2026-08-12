import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AiResponse, ChatRequest, NutritionPlanRequest, TrainingProgramRequest } from '../models/ai.model';

@Injectable({ providedIn: 'root' })
export class AiService {
  private baseUrl = `${environment.apiUrl}/ai`;

  constructor(private http: HttpClient) {}

  generateTrainingProgram(request: TrainingProgramRequest): Observable<AiResponse> {
    return this.http.post<AiResponse>(`${this.baseUrl}/programme-sportif`, request);
  }

  generateNutritionPlan(request: NutritionPlanRequest): Observable<AiResponse> {
    return this.http.post<AiResponse>(`${this.baseUrl}/plan-alimentaire`, request);
  }

  chat(request: ChatRequest): Observable<AiResponse> {
    return this.http.post<AiResponse>(`${this.baseUrl}/chat`, request);
  }

  analyzeProgress(donnees: Record<string, unknown>): Observable<AiResponse> {
    return this.http.post<AiResponse>(`${this.baseUrl}/analyse-progression`, donnees);
  }
}
