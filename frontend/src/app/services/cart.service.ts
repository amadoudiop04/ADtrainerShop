import { Injectable, signal, computed, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  imageUrl?: string;
}

const LS_KEY = 'adtrainer_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>(this.loadFromStorage());
  private _open = signal(false);

  readonly items = this._items.asReadonly();
  readonly isOpen = this._open.asReadonly();
  readonly count = computed(() => this._items().reduce((n, i) => n + i.quantity, 0));
  readonly total = computed(() => this._items().reduce((s, i) => s + i.price * i.quantity, 0));

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  add(item: Omit<CartItem, 'quantity'> & { quantity?: number }): void {
    const qty = item.quantity ?? 1;
    const match = (i: CartItem) => i.productId === item.productId && i.size === item.size;
    if (this._items().some(match)) {
      this._items.update(list => list.map(i => match(i) ? { ...i, quantity: i.quantity + qty } : i));
    } else {
      this._items.update(list => [...list, { ...item, quantity: qty }]);
    }
    this.persist();
    this._open.set(true);
  }

  remove(productId: string, size: string): void {
    this._items.update(list => list.filter(i => !(i.productId === productId && i.size === size)));
    this.persist();
  }

  updateQty(productId: string, size: string, quantity: number): void {
    if (quantity < 1) { this.remove(productId, size); return; }
    this._items.update(list =>
      list.map(i => i.productId === productId && i.size === size ? { ...i, quantity } : i)
    );
    this.persist();
  }

  clear(): void {
    this._items.set([]);
    this.persist();
  }

  open(): void { this._open.set(true); }
  close(): void { this._open.set(false); }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(LS_KEY) : null;
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private persist(): void {
    if (isPlatformBrowser(this.platformId)) {
      try { localStorage.setItem(LS_KEY, JSON.stringify(this._items())); } catch {}
    }
  }
}
