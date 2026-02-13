import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/pages/login/login-page.component').then((m) => m.LoginPageComponent),
  },
  {
    path: 'shoppingcart',
    loadComponent: () =>
      import('./cart/pages/shopping-cart/shopping-cart-page.component').then((m) => m.ShoppingCartPageComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./checkout/checkout-page.component').then((m) => m.CheckoutPageComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home-page.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./products/pages/product-detail/product-detail-page.component').then((m) => m.ProductDetailPageComponent),
  },
  {
    path: 'addProduct',
    loadComponent: () =>
      import('./admin/add-products/add-products-page.component').then((m) => m.AddProductsPageComponent),
  },
  {
    path: 'storeselector',
    loadComponent: () =>
      import('./stores/pages/store-selection/store-selection-page.component').then((m) => m.StoreSelectionPageComponent),
  },
  {
    path: 'info',
    loadComponent: () =>
      import('./information/information-page.component').then((m) => m.InformationPageComponent),
  },
  {
    path: 'intro',
    loadComponent: () =>
      import('./layout/intro/intro-page.component').then((m) => m.IntroPageComponent),
  },
  {
    path: 'add-user',
    loadComponent: () =>
      import('./auth/pages/register/register-page.component').then((m) => m.RegisterPageComponent),
  },
  {
    path: 'user-profile',
    loadComponent: () =>
      import('./user/pages/profile/profile-page.component').then((m) => m.ProfilePageComponent),
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
