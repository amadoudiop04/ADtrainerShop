import { Component } from '@angular/core';
import { SiteHeaderComponent } from './siteHeader.component';

@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [SiteHeaderComponent],
  templateUrl: '../pages/Payment/successPage.page.html',
  styleUrls: ['../pages/Payment/successPage.page.scss'],
})
export class SuccessPageComponent {}
