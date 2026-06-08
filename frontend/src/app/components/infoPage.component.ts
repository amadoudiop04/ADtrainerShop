import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf } from '@angular/common';

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [NgIf],
  templateUrl: '../pages/Info/infoPage.page.html',
  styleUrls: ['../pages/Info/infoPage.page.scss'],
})
export class InfoPageComponent implements OnInit {
  selectedService = 'Coaching 1:1';
  isContactFormOpen = false;
  accountLabel = 'Account';
  accountHref = '/login';
  languageLabel = 'FR';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.syncAccountLink();
      this.syncLanguage();
    }
    this.onScroll();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const hdr = document.getElementById('hdr');
    if (!hdr) return;
    hdr.classList.toggle('scrolled', window.scrollY > 60);
  }

  openContactForm(service: string): void {
    this.selectedService = service;
    this.isContactFormOpen = true;
  }

  closeContactForm(): void {
    this.isContactFormOpen = false;
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
