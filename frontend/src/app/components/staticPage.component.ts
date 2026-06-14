import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SiteHeaderComponent } from './siteHeader.component';

@Component({
  selector: 'app-static-page',
  standalone: true,
  imports: [SiteHeaderComponent, NgIf],
  templateUrl: '../pages/Static/staticPage.page.html',
  styleUrls: ['../pages/Static/staticPage.scss'],
})
export class StaticPageComponent implements OnInit {
  page: 'faq' | 'contact' | 'retours' = 'faq';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.page = this.route.snapshot.data['page'] ?? 'faq';
  }
}
