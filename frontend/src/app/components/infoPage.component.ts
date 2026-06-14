import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { CoachingService } from '../services/coaching.service';
import { UserService } from '../services/user.service';
import { SiteHeaderComponent } from './siteHeader.component';
import { TranslatePipe } from '../pipes/translate.pipe';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [SiteHeaderComponent, NgIf, TranslatePipe],
  templateUrl: '../pages/Info/infoPage.page.html',
  styleUrls: ['../pages/Info/infoPage.page.scss'],
})
export class InfoPageComponent implements OnInit {
  selectedService = 'Coaching 1:1';
  isContactFormOpen = false;
  formSuccess = false;
  formError = '';
  isSubmitting = false;
  constructor(
    private coachingService: CoachingService,
    private userService: UserService,
    private ts: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {}

  openContactForm(service: string): void {
    this.selectedService = service;
    this.isContactFormOpen = true;
    this.formSuccess = false;
    this.formError = '';
  }

  closeContactForm(): void {
    this.isContactFormOpen = false;
  }

  submitCoachingRequest(form: HTMLFormElement): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const data = new FormData(form);
    const serviceRaw = String(data.get('service') ?? this.selectedService);
    const coachingType = serviceRaw === 'Coaching 1:1' ? 'one_to_one' : 'e_coaching';
    const currentUser = this.userService.getLocal();

    this.formError = '';
    this.isSubmitting = true;

    this.coachingService.submit({
      full_name:     String(data.get('fullName')     ?? ''),
      email:         String(data.get('email')        ?? ''),
      phone:         String(data.get('phone')        ?? '') || undefined,
      coaching_type: coachingType,
      availability:  String(data.get('availability') ?? '') || undefined,
      user_id:       currentUser?.id ?? undefined,
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.formSuccess = true;
        form.reset();
      },
      error: () => {
        this.isSubmitting = false;
        this.formError = this.ts.t('auth.login.error.generic');
      },
    });
  }

}
