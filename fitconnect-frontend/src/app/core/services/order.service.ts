import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, OrderRequest, OrderStatus } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  create(request: OrderRequest): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, request);
  }

  myOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/me`);
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/admin/all`);
  }

  updateStatus(id: number, statut: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.baseUrl}/${id}/statut?statut=${statut}`, {});
  }
}
