import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthDrawerService {
  private _open = signal(false);
  private _mode = signal<'login' | 'register'>('login');

  readonly isOpen = this._open.asReadonly();
  readonly mode = this._mode.asReadonly();

  open(mode: 'login' | 'register' = 'login'): void {
    this._mode.set(mode);
    this._open.set(true);
  }

  close(): void {
    this._open.set(false);
  }

  setMode(mode: 'login' | 'register'): void {
    this._mode.set(mode);
  }
}
