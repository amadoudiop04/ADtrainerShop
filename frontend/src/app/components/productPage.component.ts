import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

interface Product {
  slug: string;
  badge: string;
  title: string;
  price: string;
  color: string;
  sizes: string[];
  description: string;
  details: string[];
  artClass: string;
}

const products: Product[] = [
  {
    slug: 'london-26-racing-vest',
    badge: 'Pre-order',
    title: "London '26 Racing Vest",
    price: '$70',
    color: 'Green',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Lightweight technical vest built for daily training, race day speed and controlled ventilation.',
    details: ['Breathable stretch mesh', 'Exclusive ADtrainer race graphic', 'Reflective transfer marks'],
    artClass: 'pp-art-vest',
  },
  {
    slug: 'spring-running-drop-2',
    badge: 'New drop',
    title: 'Spring Running Drop 2',
    price: '$95',
    color: 'Graphite',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'A sharp spring kit for fast sessions, warm weather volume and recovery movement.',
    details: ['Cooling knit fabric', 'Compression-ready fit', 'Low-friction seams'],
    artClass: 'pp-art-run',
  },
  {
    slug: 'elite-race-kit',
    badge: 'Limited',
    title: 'Elite Race Kit',
    price: '$120',
    color: 'Black',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Race-oriented kit with a close silhouette, high stretch and minimal visual noise.',
    details: ['Four-way stretch', 'Laser-cut hems', 'Secure micro pocket'],
    artClass: 'pp-art-elite',
  },
  {
    slug: 'valencia',
    badge: 'Archive',
    title: 'Valencia',
    price: '$85',
    color: 'Carbon',
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'A city training capsule designed around heat, long mileage and quiet technical detail.',
    details: ['Moisture control', 'Soft handfeel', 'City edition marks'],
    artClass: 'pp-art-valencia',
  },
  {
    slug: 'winter-running-25',
    badge: 'Seasonal',
    title: "Winter Running '25",
    price: '$110',
    color: 'Smoke',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Cold-weather running layer with a warmer handfeel and protective finish.',
    details: ['Thermal brushed interior', 'Wind-resistant face', 'Reflective winter line'],
    artClass: 'pp-art-winter',
  },
  {
    slug: 'outerwear',
    badge: 'Core',
    title: 'Outerwear',
    price: '$145',
    color: 'Night',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Light shell for warm-up, commute and unpredictable training conditions.',
    details: ['Water-repellent finish', 'Packable construction', 'Adjustable hood'],
    artClass: 'pp-art-outerwear',
  },
];

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: '../pages/Product/productPage.page.html',
  styleUrls: ['../pages/Product/productPage.page.scss'],
})
export class ProductPageComponent implements OnInit {
  product = products[0];
  products = products;
  accountLabel = 'Account';
  accountHref = '/login';
  languageLabel = 'FR';

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.product = products.find(item => item.slug === slug) ?? products[0];
    if (isPlatformBrowser(this.platformId)) {
      this.syncAccountLink();
      this.syncLanguage();
    }
    this.onScroll();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const hdr = document.getElementById('hdr');
    if (!hdr) return;
    hdr.classList.toggle('scrolled', window.scrollY > 60);
  }

  private syncAccountLink(): void {
    const isLoggedIn = !!localStorage.getItem('adtrainer_user');
    this.accountLabel = isLoggedIn ? 'Profile' : 'Account';
    this.accountHref = isLoggedIn ? '/profile' : '/login';
  }

  toggleLanguage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.languageLabel = this.languageLabel === 'FR' ? 'EN' : 'FR';
    localStorage.setItem('adtrainer_language', this.languageLabel);
  }

  private syncLanguage(): void {
    this.languageLabel = localStorage.getItem('adtrainer_language') || 'FR';
  }
}
