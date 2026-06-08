import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landingPage.component';
import { GalleryPageComponent } from './components/galleryPage.component';
import { ProductPageComponent } from './components/productPage.component';
import { InfoPageComponent } from './components/infoPage.component';
import { LoginPageComponent } from './components/loginPage.component';
import { RegisterPageComponent } from './components/registerPage.component';
import { ProfilePageComponent } from './components/profilePage.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'gallery', component: GalleryPageComponent },
  { path: 'infos', component: InfoPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'products/:slug', component: ProductPageComponent },
  { path: '**', redirectTo: '' },
];
