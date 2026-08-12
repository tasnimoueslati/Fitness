import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TrackingRecord, TrackingRequest } from '../models/tracking.model';

@Injectable({ providedIn: 'root' })
export class TrackingService {
  private baseUrl = `${environment.apiUrl}/tracking`;

  constructor(private http: HttpClient) {}

  addRecord(request: TrackingRequest): Observable<TrackingRecord> {
    return this.http.post<TrackingRecord>(this.baseUrl, request);
  }

  myHistory(): Observable<TrackingRecord[]> {
    return this.http.get<TrackingRecord[]>(`${this.baseUrl}/me`);
  }

  clientHistory(clientId: number): Observable<TrackingRecord[]> {
    return this.http.get<TrackingRecord[]>(`${this.baseUrl}/client/${clientId}`);
  }
}
