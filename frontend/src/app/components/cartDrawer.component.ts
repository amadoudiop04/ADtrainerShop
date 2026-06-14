import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { CartService, CartItem } from '../services/cart.service';
import { PaymentService } from '../services/payment.service';
import { UserService } from '../services/user.service';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [NgFor, NgIf, TranslatePipe],
  templateUrl: '../pages/Cart/cartDrawer.page.html',
  styleUrls: ['../pages/Cart/cartDrawer.page.scss'],
})
export class CartDrawerComponent {
  isCheckingOut = false;

  constructor(
    public cart: CartService,
    private paymentService: PaymentService,
    private userService: UserService,
  ) {}

  get items() { return this.cart.items; }
  get count() { return this.cart.count; }
  get total() { return this.cart.total; }
  get user() { return this.userService.getLocal(); }

  close(): void { this.cart.close(); }
  clear(): void { this.cart.clear(); }

  remove(item: CartItem): void {
    this.cart.remove(item.productId, item.size);
  }

  increment(item: CartItem): void {
    this.cart.updateQty(item.productId, item.size, item.quantity + 1);
  }

  decrement(item: CartItem): void {
    this.cart.updateQty(item.productId, item.size, item.quantity - 1);
  }

  checkout(): void {
    const currentUser = this.userService.getLocal();
    if (!currentUser) return;

    this.isCheckingOut = true;
    this.paymentService.createCheckoutSession(currentUser.id, this.cart.items()).subscribe({
      next: ({ sessionUrl }) => {
        this.cart.clear();
        window.location.href = sessionUrl;
      },
      error: () => {
        this.isCheckingOut = false;
      },
    });
  }
}
