import { Routes } from '@angular/router';
import { AddProductsComponent } from './admin/add-products/add-products.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { InformationComponent } from './information/information.component';
import { ProductDetailComponent } from './products/pages/product-detail/product-detail.component';
import { HomeComponent } from './home/home.component';
import { ShoppingCartComponent } from './cart/pages/shopping-cart/shopping-cart.component';
import { StoreSelectedComponent } from './stores/pages/store-selection/store-selection.component';
import { IntroComponent } from './layout/intro/intro.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { RegisterComponent } from './auth/pages/register/register.component';
import { ProfileComponent } from './user/pages/profile/profile.component';

export const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'shoppingcart', component: ShoppingCartComponent
  },
  {
    path: 'checkout', component: CheckoutComponent
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'products/:id', component: ProductDetailComponent
  },
  {
    path: 'addProduct', component: AddProductsComponent
  },
  {
    path: 'storeselector', component: StoreSelectedComponent
  },
  {
    path: 'info', component: InformationComponent
  },
  {
    path: 'intro', component: IntroComponent
  },
  {
    path: 'add-user', component: RegisterComponent
  },
  {
    path: 'user-profile', component: ProfileComponent
  },
  {
    path: '**', redirectTo: '/home', pathMatch: 'full'
  }
];
