import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ContainerScrollComponent } from './containerScroll.component';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [ContainerScrollComponent],
  templateUrl: '../pages/Gallery/galleryPage.page.html',
  styleUrls: ['../pages/Gallery/galleryPage.page.scss'],
})
export class GalleryPageComponent implements OnInit {
  accountLabel = 'Account';
  accountHref = '/login';
  languageLabel = 'FR';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.syncAccountLink();
    this.syncLanguage();
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
