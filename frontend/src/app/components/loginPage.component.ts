import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: '../pages/Auth/loginPage.page.html',
  styleUrls: ['../pages/Auth/authPage.page.scss'],
})
export class LoginPageComponent implements OnInit {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.onScroll();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const hdr = document.getElementById('hdr');
    if (!hdr) return;
    hdr.classList.toggle('scrolled', window.scrollY > 60);
  }

  login(form: HTMLFormElement): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const data = new FormData(form);
    const email = String(data.get('email') ?? '');

    localStorage.setItem('adtrainer_user', JSON.stringify({
      email,
      firstName: 'ADtrainer',
      lastName: 'Member',
      phone: '',
      role: 'customer',
      isActive: true,
      createdAt: new Date().toISOString(),
    }));

    this.router.navigateByUrl('/profile');
  }
}
