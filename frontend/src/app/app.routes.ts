import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { LandingPageComponent } from './components/landingPage.component';
import { GalleryPageComponent } from './components/galleryPage.component';
import { ProductPageComponent } from './components/productPage.component';
import { InfoPageComponent } from './components/infoPage.component';
import { ProfilePageComponent } from './components/profilePage.component';
import { StaticPageComponent } from './components/staticPage.component';
import { SuccessPageComponent } from './components/successPage.component';
import { AuthDrawerService } from './services/auth-drawer.service';

const authDrawerGuard: CanActivateFn = (_route, state) => {
  const drawer = inject(AuthDrawerService);
  const router = inject(Router);
  const mode: 'login' | 'register' = state.url.includes('register') ? 'register' : 'login';
  drawer.open(mode);
  return router.createUrlTree(['/']);
};

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'gallery', component: GalleryPageComponent },
  { path: 'infos', component: InfoPageComponent },
  { path: 'login', canActivate: [authDrawerGuard], component: LandingPageComponent },
  { path: 'register', canActivate: [authDrawerGuard], component: LandingPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'faq', component: StaticPageComponent, data: { page: 'faq' } },
  { path: 'contact', component: StaticPageComponent, data: { page: 'contact' } },
  { path: 'retours', component: StaticPageComponent, data: { page: 'retours' } },
  { path: 'products/:slug', component: ProductPageComponent },
  { path: 'payment/success', component: SuccessPageComponent },
  { path: '**', redirectTo: '' },
];
