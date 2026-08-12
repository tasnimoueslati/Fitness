import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, Product, ProductRequest } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(search?: string, categoryId?: number): Observable<Product[]> {
    let params = '';
    if (search) params += `search=${encodeURIComponent(search)}`;
    if (categoryId) params += (params ? '&' : '') + `categoryId=${categoryId}`;
    return this.http.get<Product[]>(`${this.baseUrl}/public/products${params ? '?' + params : ''}`);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/public/products/${id}`);
  }

  topSelling(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/public/products/top-selling`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/public/categories`);
  }

  create(request: ProductRequest): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/admin/products`, request);
  }

  update(id: number, request: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/admin/products/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/products/${id}`);
  }
}
