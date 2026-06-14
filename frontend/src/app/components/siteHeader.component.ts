import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { TranslationService } from '../services/translation.service';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [NgIf, TranslatePipe],
  template: `
<header id="hdr" class="sh-header" [class.scrolled]="scrolled">
  <nav class="sh-nav">
    <a [href]="overviewHref" class="sh-nav-link" [class.active]="isActive('/')">{{ 'nav.overview' | t }}</a>
    <a href="/gallery" class="sh-nav-link" [class.active]="isActive('/gallery')">{{ 'nav.gallery' | t }}</a>
    <a href="/infos" class="sh-nav-link" [class.active]="isActive('/infos')">{{ 'nav.infos' | t }}</a>
  </nav>

  <a href="/" class="sh-logo">
    <img src="LogoADTrainer-removebg-preview.png" alt="ADtrainer Shop" class="sh-logo-img" />
  </a>

  <div class="sh-right">
    <button type="button" class="sh-lang-btn"
      (click)="toggleLanguage()"
      [attr.aria-label]="'Switch language: ' + ts.lang()">
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.1">
        <circle cx="7" cy="7" r="5.8"/>
        <ellipse cx="7" cy="7" rx="2.6" ry="5.8"/>
        <line x1="1.2" y1="7" x2="12.8" y2="7"/>
        <line x1="7" y1="1.2" x2="7" y2="12.8"/>
      </svg>
      {{ ts.lang() }}
    </button>

    <button type="button" class="sh-cart-btn" (click)="openCart()" aria-label="Panier">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/>
      </svg>
      <span class="sh-cart-badge" *ngIf="cartCount() > 0">{{ cartCount() }}</span>
    </button>

    <a [href]="accountHref" class="sh-account-btn">{{ accountLabelKey | t }}</a>
  </div>
</header>
  `,
  styleUrls: ['./siteHeader.component.scss'],
})
export class SiteHeaderComponent implements OnInit {
  scrolled = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    public ts: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  get cartCount() { return this.cartService.count; }

  openCart(): void { this.cartService.open(); }

  get accountHref(): string {
    if (!isPlatformBrowser(this.platformId)) return '/login';
    return localStorage.getItem('adtrainer_user') ? '/profile' : '/login';
  }

  get accountLabelKey(): string {
    if (!isPlatformBrowser(this.platformId)) return 'header.account';
    return localStorage.getItem('adtrainer_user') ? 'header.profile' : 'header.account';
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.scrolled = this.router.url !== '/';
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId) || this.router.url !== '/') return;
    this.scrolled = window.scrollY > 60;
  }

  get overviewHref(): string {
    return this.router.url === '/' ? '#hero' : '/';
  }

  isActive(route: string): boolean {
    if (route === '/') return this.router.url === '/';
    return this.router.url.startsWith(route);
  }

  toggleLanguage(): void {
    this.ts.toggle();
  }
}
