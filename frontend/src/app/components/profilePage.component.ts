import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

interface LocalUser {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [NgIf],
  templateUrl: '../pages/Profile/profilePage.page.html',
  styleUrls: ['../pages/Profile/profilePage.page.scss'],
})
export class ProfilePageComponent implements OnInit {
  user: LocalUser | null = null;
  isEditing = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.onScroll();
    if (!isPlatformBrowser(this.platformId)) return;
    const raw = localStorage.getItem('adtrainer_user');
    this.user = raw ? JSON.parse(raw) : null;
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const hdr = document.getElementById('hdr');
    if (!hdr) return;
    hdr.classList.toggle('scrolled', window.scrollY > 60);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('adtrainer_user');
    }
    this.router.navigateByUrl('/login');
  }

  startEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  saveProfile(form: HTMLFormElement): void {
    if (!isPlatformBrowser(this.platformId) || !this.user) return;
    const data = new FormData(form);
    this.user = {
      ...this.user,
      firstName: String(data.get('firstName') ?? ''),
      lastName: String(data.get('lastName') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
    };
    localStorage.setItem('adtrainer_user', JSON.stringify(this.user));
    this.isEditing = false;
  }
}
