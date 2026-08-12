import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review, ReviewRequest, ReviewTargetType } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private baseUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  add(request: ReviewRequest): Observable<Review> {
    return this.http.post<Review>(this.baseUrl, request);
  }

  getFor(targetType: ReviewTargetType, targetId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}?targetType=${targetType}&targetId=${targetId}`);
  }
}
