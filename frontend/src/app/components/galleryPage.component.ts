import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { SiteHeaderComponent } from './siteHeader.component';
import { ContainerScrollComponent } from './containerScroll.component';
import { ProductService, ApiProduct } from '../services/product.service';
import { SettingsService } from '../services/settings.service';
import { UserService } from '../services/user.service';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [SiteHeaderComponent, ContainerScrollComponent, NgFor, NgIf, TranslatePipe],
  templateUrl: '../pages/Gallery/galleryPage.page.html',
  styleUrls: ['../pages/Gallery/galleryPage.page.scss'],
})
export class GalleryPageComponent implements OnInit {
  products: ApiProduct[] = [];
  isLoadingProducts = true;
  loadError = false;
  shopOpen = true;
  isAdmin = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private productService: ProductService,
    private settingsService: SettingsService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const user = this.userService.getLocal();
    this.isAdmin = user?.role === 'admin';

    this.settingsService.getShopStatus().subscribe({
      next: ({ open }) => {
        this.shopOpen = open;
        if (open || this.isAdmin) this.loadProducts();
      },
      error: () => {
        // If we can't reach the API, assume open
        this.shopOpen = true;
        this.loadProducts();
      },
    });
  }

  private loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoadingProducts = false;
      },
      error: () => {
        this.loadError = true;
        this.isLoadingProducts = false;
      },
    });
  }

  formatPrice(price: number): string {
    return `€${price.toFixed(0)}`;
  }

  getImageUrl(product: ApiProduct): string {
    return product.image_url ?? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=320&fit=crop&q=80';
  }

}
