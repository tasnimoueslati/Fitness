import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Availability, Nutritionist } from '../models/coach.model';

@Injectable({ providedIn: 'root' })
export class NutritionistService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Nutritionist[]> {
    return this.http.get<Nutritionist[]>(`${this.baseUrl}/public/nutritionnistes`);
  }

  getById(id: number): Observable<Nutritionist> {
    return this.http.get<Nutritionist>(`${this.baseUrl}/public/nutritionnistes/${id}`);
  }

  getAvailability(id: number): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${this.baseUrl}/public/nutritionnistes/${id}/disponibilites`);
  }

  getMyProfile(): Observable<Nutritionist> {
    return this.http.get<Nutritionist>(`${this.baseUrl}/nutritionniste/me`);
  }

  updateProfile(id: number, updates: Partial<Nutritionist>): Observable<Nutritionist> {
    return this.http.put<Nutritionist>(`${this.baseUrl}/nutritionniste/${id}`, updates);
  }

  addAvailability(id: number, availability: Availability): Observable<Availability> {
    return this.http.post<Availability>(`${this.baseUrl}/nutritionniste/${id}/disponibilites`, availability);
  }

  deleteAvailability(availabilityId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/nutritionniste/disponibilites/${availabilityId}`);
  }
}
