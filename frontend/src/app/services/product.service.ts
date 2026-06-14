import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  image_url_2?: string;
  image_url_3?: string;
  image_url_4?: string;
  status: 'available' | 'out_of_stock' | 'archived';
  available_sizes: string[];
  collection_id?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiProduct[]> {
    return this.http.get<ApiProduct[]>(`${this.base}/products`);
  }

  getBySlug(slug: string): Observable<ApiProduct> {
    return this.http.get<ApiProduct>(`${this.base}/products/slug/${slug}`);
  }
}
