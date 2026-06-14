import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { NgIf } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthDrawerService } from '../services/auth-drawer.service';
import { UserService } from '../services/user.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-auth-drawer',
  standalone: true,
  imports: [NgIf, TranslatePipe],
  templateUrl: '../pages/Auth/authDrawer.page.html',
  styleUrls: ['../pages/Auth/authDrawer.scss'],
})
export class AuthDrawerComponent {
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  constructor(
    public drawerService: AuthDrawerService,
    private userService: UserService,
    private router: Router,
    private ts: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  private leaveTimer: ReturnType<typeof setTimeout> | null = null;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.drawerService.close();
  }

  onMouseLeave(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const active = document.activeElement;
    if (active instanceof HTMLElement &&
        (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) {
      return;
    }
    this.leaveTimer = setTimeout(() => this.drawerService.close(), 600);
  }

  onMouseEnter(): void {
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }
  }

  switchMode(mode: 'login' | 'register'): void {
    this.errorMessage = '';
    this.showPassword = false;
    this.drawerService.setMode(mode);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(form: HTMLFormElement): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const data = new FormData(form);
    const email = String(data.get('email') ?? '');
    const password = String(data.get('password') ?? '');

    this.errorMessage = '';
    this.isLoading = true;

    this.userService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.drawerService.close();
        this.router.navigateByUrl('/profile');
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.status === 401
          ? this.ts.t('auth.login.error.credentials')
          : this.ts.t('auth.login.error.generic');
      },
    });
  }

  register(form: HTMLFormElement): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const data = new FormData(form);
    const firstName = String(data.get('firstName') ?? '');
    const lastName  = String(data.get('lastName')  ?? '');
    const email     = String(data.get('email')     ?? '');
    const password  = String(data.get('password')  ?? '');
    const phone     = String(data.get('phone')     ?? '') || undefined;

    this.errorMessage = '';
    this.isLoading = true;

    this.userService.register({ firstName, lastName, email, password, phone }).subscribe({
      next: () => {
        this.isLoading = false;
        this.drawerService.close();
        this.router.navigateByUrl('/profile');
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.status === 409
          ? this.ts.t('auth.register.error.exists')
          : this.ts.t('auth.register.error.generic');
      },
    });
  }
}
