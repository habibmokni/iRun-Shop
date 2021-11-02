import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductsComponent } from './add-products/add-products.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { DeliveryComponent } from './checkout/delivery/delivery.component';
import { InformationComponent } from './information/information.component';
import { ProductPageComponent } from './home/product-page/product-page.component';
import { HomeComponent } from './home/home.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { StoreSelectedComponent } from './store-selected/store-selected.component';

const routes: Routes = [
  { path: 'shoppingcart', component: ShoppingCartComponent},
  { path: 'checkout', component: CheckoutComponent},
  { path: 'home', component: HomeComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'products/:id', component: ProductPageComponent},
  { path: 'add-product', component: AddProductsComponent},
  { path: 'delivery' , component: DeliveryComponent},
  {path: 'storeselected', component: StoreSelectedComponent},
  {path: 'info', component: InformationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes , {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
