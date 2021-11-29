import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductsComponent } from './addProducts/addProducts.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { InformationComponent } from './information/information.component';
import { ProductPageComponent } from './home/productPage/productPage.component';
import { HomeComponent } from './home/home.component';
import { ShoppingCartComponent } from './shoppingCart/shoppingCart.component';
import { StoreSelectedComponent } from './storeSelect/storeSelectcomponent';
import { IntroComponent } from './shared/intro/intro.component';

const routes: Routes = [
  { path: 'shoppingcart', component: ShoppingCartComponent} ,
  { path: 'checkout', component: CheckoutComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'products/:id', component: ProductPageComponent },
  { path: 'addProduct', component: AddProductsComponent },
  { path: 'storeselector', component: StoreSelectedComponent },
  { path: 'info', component: InformationComponent },
  { path: 'intro', component: IntroComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes , {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
