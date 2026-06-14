import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SiteHeaderComponent } from './siteHeader.component';
import { ProductService, ApiProduct } from '../services/product.service';
import { CartService } from '../services/cart.service';

interface ProductView {
  productId: string;
  slug: string;
  badge: string;
  title: string;
  price: number;
  priceLabel: string;
  color: string;
  sizes: string[];
  description: string;
  details: string[];
  artClass: string;
  imageUrls: string[];
  status: 'available' | 'out_of_stock' | 'archived';
}

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Local fallback catalogue (used only when API is unreachable)
const fallback: ProductView[] = [
  {
    productId: '',
    slug: 'london-26-racing-vest',
    badge: 'Pre-order',
    title: "London '26 Racing Vest",
    price: 70,
    priceLabel: '€70',
    color: 'Green',
    sizes: DEFAULT_SIZES,
    description: 'Lightweight technical vest built for daily training, race day speed and controlled ventilation.',
    details: ['Breathable stretch mesh', 'Exclusive ADtrainer race graphic', 'Reflective transfer marks'],
    artClass: 'pp-art-vest',
    imageUrls: [],
    status: 'available',
  },
  {
    productId: '',
    slug: 'spring-running-drop-2',
    badge: 'New drop',
    title: 'Spring Running Drop 2',
    price: 95,
    priceLabel: '€95',
    color: 'Graphite',
    sizes: DEFAULT_SIZES,
    description: 'A sharp spring kit for fast sessions, warm weather volume and recovery movement.',
    details: ['Cooling knit fabric', 'Compression-ready fit', 'Low-friction seams'],
    artClass: 'pp-art-run',
    imageUrls: [],
    status: 'available',
  },
  {
    productId: '',
    slug: 'elite-race-kit',
    badge: 'Limited',
    title: 'Elite Race Kit',
    price: 120,
    priceLabel: '€120',
    color: 'Black',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Race-oriented kit with a close silhouette, high stretch and minimal visual noise.',
    details: ['Four-way stretch', 'Laser-cut hems', 'Secure micro pocket'],
    artClass: 'pp-art-elite',
    imageUrls: [],
    status: 'available',
  },
  {
    productId: '',
    slug: 'valencia',
    badge: 'Archive',
    title: 'Valencia',
    price: 85,
    priceLabel: '€85',
    color: 'Carbon',
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'A city training capsule designed around heat, long mileage and quiet technical detail.',
    details: ['Moisture control', 'Soft handfeel', 'City edition marks'],
    artClass: 'pp-art-valencia',
    imageUrls: [],
    status: 'archived',
  },
  {
    productId: '',
    slug: 'winter-running-25',
    badge: 'Seasonal',
    title: "Winter Running '25",
    price: 110,
    priceLabel: '€110',
    color: 'Smoke',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Cold-weather running layer with a warmer handfeel and protective finish.',
    details: ['Thermal brushed interior', 'Wind-resistant face', 'Reflective winter line'],
    artClass: 'pp-art-winter',
    imageUrls: [],
    status: 'available',
  },
  {
    productId: '',
    slug: 'outerwear',
    badge: 'Core',
    title: 'Outerwear',
    price: 145,
    priceLabel: '€145',
    color: 'Night',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Light shell for warm-up, commute and unpredictable training conditions.',
    details: ['Water-repellent finish', 'Packable construction', 'Adjustable hood'],
    artClass: 'pp-art-outerwear',
    imageUrls: [],
    status: 'available',
  },
];

const mapApiToView = (p: ApiProduct): ProductView => ({
  productId:   p.id,
  slug:        p.slug,
  badge:       p.status === 'available' ? 'Available' : p.status === 'out_of_stock' ? 'Out of stock' : 'Archive',
  title:       p.name,
  price:       p.price,
  priceLabel:  `€${p.price}`,
  color:       '',
  sizes:       p.available_sizes?.length ? p.available_sizes : DEFAULT_SIZES,
  description: p.description ?? '',
  details:     [],
  artClass:    'pp-art-run',
  imageUrls:   [p.image_url, p.image_url_2, p.image_url_3, p.image_url_4].filter((u): u is string => !!u),
  status:      p.status,
});

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [SiteHeaderComponent, NgFor, NgIf],
  templateUrl: '../pages/Product/productPage.page.html',
  styleUrls: ['../pages/Product/productPage.page.scss'],
})
export class ProductPageComponent implements OnInit {
  product: ProductView = fallback[0];
  isLoading = true;
  selectedSize: string | null = null;
  sizeError = false;
  addedToCart = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.productService.getBySlug(slug).subscribe({
      next: (p) => {
        this.product = mapApiToView(p);
        this.isLoading = false;
      },
      error: () => {
        this.product = fallback.find(p => p.slug === slug) ?? fallback[0];
        this.isLoading = false;
      },
    });
  }

  selectSize(size: string): void {
    this.selectedSize = size;
    this.sizeError = false;
  }

  addToCart(): void {
    if (this.product.sizes.length > 0 && !this.selectedSize) {
      this.sizeError = true;
      return;
    }
    this.cartService.add({
      productId: this.product.productId,
      slug:      this.product.slug,
      name:      this.product.title,
      price:     this.product.price,
      size:      this.selectedSize ?? '',
      imageUrl:  this.product.imageUrls[0],
    });
    this.addedToCart = true;
    setTimeout(() => { this.addedToCart = false; }, 2000);
  }
}
