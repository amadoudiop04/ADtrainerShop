import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, effect, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, UserProfile } from '../services/user.service';
import { AuthDrawerService } from '../services/auth-drawer.service';
import { SettingsService } from '../services/settings.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [NgIf, TranslatePipe],
  templateUrl: '../pages/Profile/profilePage.page.html',
  styleUrls: ['../pages/Profile/profilePage.page.scss'],
})
export class ProfilePageComponent implements OnInit {
  user: UserProfile | null = null;
  isEditing = false;
  isSaving = false;
  saveError = '';
  shopOpen: boolean | null = null;
  isShopToggling = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private authDrawer: AuthDrawerService,
    private settingsService: SettingsService,
    private ts: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    // Re-read user from localStorage whenever the auth drawer toggles open/close,
    // so the profile updates immediately after login without requiring a re-navigation.
    effect(() => {
      this.authDrawer.isOpen();
      this.user = this.userService.getLocal();
    });
  }

  ngOnInit(): void {
    this.onScroll();
    this.user = this.userService.getLocal();
    if (this.user?.role === 'admin') {
      this.settingsService.getShopStatus().subscribe({
        next: ({ open }) => (this.shopOpen = open),
        error: () => (this.shopOpen = true),
      });
    }
  }

  toggleShop(): void {
    if (!this.user?.id || this.isShopToggling || this.shopOpen === null) return;
    this.isShopToggling = true;
    const next = !this.shopOpen;
    this.settingsService.setShopStatus(next, this.user.id).subscribe({
      next: ({ open }) => {
        this.shopOpen = open;
        this.isShopToggling = false;
      },
      error: () => (this.isShopToggling = false),
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const hdr = document.getElementById('hdr');
    if (!hdr) return;
    hdr.classList.toggle('scrolled', window.scrollY > 60);
  }

  get initials(): string {
    const f = this.user?.firstName?.[0] ?? '';
    const l = this.user?.lastName?.[0] ?? '';
    return (f + l).toUpperCase() || '?';
  }

get memberSince(): string {
    if (!this.user?.createdAt) return '—';
    try {
      return new Date(this.user.createdAt).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return this.user.createdAt;
    }
  }

  openLogin(): void {
    this.authDrawer.open('login');
  }

  logout(): void {
    this.userService.logout();
    this.router.navigateByUrl('/');
  }

  startEditing(): void {
    this.isEditing = true;
    this.saveError = '';
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  saveProfile(form: HTMLFormElement): void {
    if (!this.user?.id) return;
    const data = new FormData(form);
    const updates = {
      firstName: String(data.get('firstName') ?? ''),
      lastName:  String(data.get('lastName')  ?? ''),
      email:     String(data.get('email')     ?? ''),
      phone:     String(data.get('phone')     ?? ''),
    };

    this.isSaving = true;
    this.saveError = '';

    this.userService.updateProfile(this.user.id, updates).subscribe({
      next: (updated) => {
        this.user = updated;
        this.isEditing = false;
        this.isSaving = false;
      },
      error: () => {
        this.isSaving = false;
        this.saveError = this.ts.t('profile.saveError');
      },
    });
  }
}
