import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleMapsModule } from '@angular/google-maps';
import { AngularFireModule } from '@angular/fire/compat';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProductPageComponent } from './shop/product-page/product-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapsComponent } from './maps/maps.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ShippingMethodsComponent } from './checkout/shipping-methods/shipping-methods.component';
import { BillingDetailsComponent } from './checkout/billing-details/billing-details.component';
import { PaymentMethodsComponent } from './checkout/payment-methods/payment-methods.component';
import { environment } from 'src/environments/environment';
import { StoreService } from './shared/services/store.service';
import { MapsService } from './shared/services/maps.service';
import { ProductService } from './shared/services/product.service';
import { AvailabilityComponent } from './shop/product-page/availability/availability.component';
import { ShopComponent } from './shop/shop.component';
import { SnackbarService } from './shared/services/snackbar.service';
import { ImageSliderComponent } from './shop/image-slider/image-slider.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { OrderSuccessComponent } from './checkout/order-success/order-success.component';
import { HomeComponent } from './home/home.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { FooterComponent } from './footer/footer.component';
import { DeliveryComponent } from './checkout/delivery/delivery.component';
import { UserService } from './shared/services/user.service';
import { AddToCartComponent } from './shop/add-to-cart/add-to-cart.component';
import { StoreSelectedComponent } from './store-selected/store-selected.component';
import { ClickNCollectModule } from '@habibmokni/cnc';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductPageComponent,
    ShoppingCartComponent,
    MapsComponent,
    CheckoutComponent,
    ShippingMethodsComponent,
    BillingDetailsComponent,
    PaymentMethodsComponent,
    AvailabilityComponent,
    ShopComponent,
    ImageSliderComponent,
    OrderSuccessComponent,
    HomeComponent,
    AddProductsComponent,
    FooterComponent,
    DeliveryComponent,
    AddToCartComponent,
    StoreSelectedComponent
  ],
  imports: [
    BrowserModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatTimepickerModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    ClickNCollectModule
  ],
  providers: [StoreService, MapsService, ProductService, SnackbarService, UserService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
