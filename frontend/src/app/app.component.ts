import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthDrawerComponent } from './components/authDrawer.component';
import { FooterComponent } from './components/footer.component';
import { CartDrawerComponent } from './components/cartDrawer.component';
import { CartService } from './services/cart.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AuthDrawerComponent, FooterComponent, CartDrawerComponent, NgIf],
  template: `
    <router-outlet />
    <app-auth-drawer />
    <app-cart-drawer *ngIf="cart.isOpen()" />
    <app-footer />
  `,
})
export class AppComponent {
  title = 'adtrainer-shop';
  constructor(public cart: CartService) {}
}
