import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, BookingRequest, BookingStatus } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private baseUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  create(request: BookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.baseUrl, request);
  }

  myBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/me`);
  }

  coachBookings(coachId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/coach/${coachId}`);
  }

  nutritionistBookings(nutritionistId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/nutritionniste/${nutritionistId}`);
  }

  updateStatus(id: number, statut: BookingStatus): Observable<Booking> {
    return this.http.patch<Booking>(`${this.baseUrl}/${id}/statut?statut=${statut}`, {});
  }

  cancel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
