import { Component } from '@angular/core';
import { SiteHeaderComponent } from './siteHeader.component';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [SiteHeaderComponent, TranslatePipe],
  templateUrl: '../pages/Home/landingPage.page.html',
  styleUrls: ['../pages/Home/landingPage.page.scss'],
})
export class LandingPageComponent {}
