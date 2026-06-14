import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartItem } from './cart.service';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createCheckoutSession(
    userId: string,
    items: CartItem[],
    shippingAddress?: string,
  ): Observable<{ sessionUrl: string; orderId: string }> {
    return this.http.post<{ sessionUrl: string; orderId: string }>(
      `${this.base}/payments/create-checkout-session`,
      {
        userId,
        items: items.map(i => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          size: i.size,
          imageUrl: i.imageUrl,
        })),
        shippingAddress,
      },
    );
  }
}
