import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [NgIf, TranslatePipe],
  templateUrl: '../pages/Auth/loginPage.page.html',
  styleUrls: ['../pages/Auth/authPage.page.scss'],
})
export class LoginPageComponent implements OnInit {
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private ts: TranslationService,
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
}
