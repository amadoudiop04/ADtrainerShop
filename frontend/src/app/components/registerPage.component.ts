import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [NgIf, TranslatePipe],
  templateUrl: '../pages/Auth/registerPage.page.html',
  styleUrls: ['../pages/Auth/authPage.page.scss'],
})
export class RegisterPageComponent implements OnInit {
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

  register(form: HTMLFormElement): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const data = new FormData(form);

    this.errorMessage = '';
    this.isLoading = true;

    this.userService.register({
      firstName: String(data.get('firstName') ?? ''),
      lastName:  String(data.get('lastName')  ?? ''),
      email:     String(data.get('email')     ?? ''),
      password:  String(data.get('password')  ?? ''),
      phone:     String(data.get('phone')     ?? '') || undefined,
    }).subscribe({
      next: () => {
        this.isLoading = false;
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
