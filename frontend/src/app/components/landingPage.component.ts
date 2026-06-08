import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: '../pages/Home/landingPage.page.html',
  styleUrls: ['../pages/Home/landingPage.page.scss'],
})
export class LandingPageComponent implements OnInit, OnDestroy {

  private observer!: IntersectionObserver;
  accountLabel = 'Account';
  accountHref = '/login';
  languageLabel = 'FR';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.syncAccountLink();
    this.syncLanguage();

    // ── scroll-aware header ──
    this.onScroll();

    // ── active nav via IntersectionObserver ──
    const sections = [
      { id: 'hero',    navHref: '#hero' },
      { id: 'infos',   navHref: '#infos' },
    ];

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const links = document.querySelectorAll<HTMLAnchorElement>('.lp-nav-link');
        links.forEach(l => l.classList.remove('active'));
        const match = sections.find(s => s.id === entry.target.id);
        if (match) {
          const active = document.querySelector<HTMLAnchorElement>(`.lp-nav-link[href="${match.navHref}"]`);
          active?.classList.add('active');
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const hdr = document.getElementById('hdr');
    if (!hdr) return;
    hdr.classList.toggle('scrolled', window.scrollY > 60);
  }

  private syncAccountLink(): void {
    const isLoggedIn = !!localStorage.getItem('adtrainer_user');
    this.accountLabel = isLoggedIn ? 'Profile' : 'Account';
    this.accountHref = isLoggedIn ? '/profile' : '/login';
  }

  toggleLanguage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.languageLabel = this.languageLabel === 'FR' ? 'EN' : 'FR';
    localStorage.setItem('adtrainer_language', this.languageLabel);
  }

  private syncLanguage(): void {
    this.languageLabel = localStorage.getItem('adtrainer_language') || 'FR';
  }
}
