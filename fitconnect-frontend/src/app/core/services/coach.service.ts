import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Availability, Coach } from '../models/coach.model';

@Injectable({ providedIn: 'root' })
export class CoachService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Coach[]> {
    return this.http.get<Coach[]>(`${this.baseUrl}/public/coaches`);
  }

  getById(id: number): Observable<Coach> {
    return this.http.get<Coach>(`${this.baseUrl}/public/coaches/${id}`);
  }

  getAvailability(coachId: number): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${this.baseUrl}/public/coaches/${coachId}/disponibilites`);
  }

  getMyProfile(): Observable<Coach> {
    return this.http.get<Coach>(`${this.baseUrl}/coach/me`);
  }

  updateProfile(id: number, updates: Partial<Coach>): Observable<Coach> {
    return this.http.put<Coach>(`${this.baseUrl}/coach/${id}`, updates);
  }

  addAvailability(coachId: number, availability: Availability): Observable<Availability> {
    return this.http.post<Availability>(`${this.baseUrl}/coach/${coachId}/disponibilites`, availability);
  }

  deleteAvailability(availabilityId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/coach/disponibilites/${availabilityId}`);
  }
}
