import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleMapsModule } from '@angular/google-maps';
import { AngularFireModule } from '@angular/fire/compat';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';


import { AppRoutingModule } from './appRouting.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProductPageComponent } from './home/productPage/productPage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShoppingCartComponent } from './shoppingCart/shoppingCart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutComponent } from './checkout/checkout.component';
import { BillingDetailsComponent } from './checkout/billingDetails/billingDetails.component';
import { PaymentMethodsComponent } from './checkout/paymentMethods/paymentMethods.component';
import { environment } from 'src/environments/environment';
import { StoreService } from './shared/services/store.service';
import { ProductService } from './shared/services/product.service';
import { SnackbarService } from './shared/services/snackbar.service';
import { ImageSliderComponent } from './home/imageSlider/imageSlider.component';
import { OrderSuccessComponent } from './checkout/orderSuccess/order-success.component';
import { AddProductsComponent } from './addProducts/addProducts.component';
import { FooterComponent } from './footer/footer.component';
import { UserService } from './shared/services/user.service';
import { AddToCartComponent } from './home/addToCart/addToCart.component';
import { StoreSelectedComponent } from './storeSelect/storeSelectcomponent';
import { ClickNCollectModule } from '@habibmokni/cnc';
import { InformationComponent } from './information/information.component';
import { HomeComponent } from './home/home.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductPageComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    BillingDetailsComponent,
    PaymentMethodsComponent,
    HomeComponent,
    ImageSliderComponent,
    OrderSuccessComponent,
    AddProductsComponent,
    FooterComponent,
    AddToCartComponent,
    StoreSelectedComponent,
    InformationComponent
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
    FlexLayoutModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ClickNCollectModule
  ],
  providers: [StoreService, ProductService, SnackbarService, UserService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
