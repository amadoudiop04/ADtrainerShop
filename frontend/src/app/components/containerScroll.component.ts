import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-container-scroll',
  standalone: true,
  template: `
    <section class="cs-shell" #container>
      <div class="cs-perspective">
        <div class="cs-header" [style.transform]="headerTransform">
          <ng-content select="[scroll-title]"></ng-content>
        </div>

        <div class="cs-card" [style.transform]="cardTransform">
          <div class="cs-card-inner">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['../pages/Gallery/containerScroll.component.scss'],
})
export class ContainerScrollComponent implements AfterViewInit {
  @ViewChild('container') container?: ElementRef<HTMLElement>;

  headerTransform = 'translateY(0px)';
  cardTransform = 'rotateX(20deg) scale(1.05)';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    this.updateTransform();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  updateTransform(): void {
    if (!isPlatformBrowser(this.platformId) || !this.container) return;

    const rect = this.container.nativeElement.getBoundingClientRect();
    const viewport = window.innerHeight || 1;
    const total = rect.height + viewport;
    const rawProgress = (viewport - rect.top) / total;
    const progress = Math.min(Math.max(rawProgress, 0), 1);
    const isMobile = window.innerWidth <= 768;
    const startScale = isMobile ? 0.82 : 1.02;
    const endScale = isMobile ? 0.96 : 1;
    const rotate = 10 * (1 - progress);
    const scale = startScale + (endScale - startScale) * progress;
    const translate = -100 * progress;

    this.headerTransform = `translateY(${translate}px)`;
    this.cardTransform = `rotateX(${rotate}deg) scale(${scale})`;
  }
}
