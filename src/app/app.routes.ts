import { Routes } from '@angular/router';
import { AddProductsComponent } from './addProducts/addProducts.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { InformationComponent } from './information/information.component';
import { ProductPageComponent } from './home/productPage/productPage.component';
import { HomeComponent } from './home/home.component';
import { ShoppingCartComponent } from './shoppingCart/shoppingCart.component';
import { StoreSelectedComponent } from './storeSelect/storeSelectcomponent';
import { IntroComponent } from './shared/intro/intro.component';
import { LoginComponent } from './auth/login/login.component';
import { AddUserComponent } from './shared/add-user/add-user.component';
import { UserProfileComponent } from './shared/user-profile/user-profile.component';

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
    path: 'products/:id', component: ProductPageComponent
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
    path: 'add-user', component: AddUserComponent
  },
  {
    path: 'user-profile', component: UserProfileComponent
  },
  {
    path: '**', redirectTo: '/home', pathMatch: 'full'
  }
];
