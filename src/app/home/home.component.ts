import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { CartProduct } from '../shared/models/cartProduct.model';
import { Product } from '../shared/models/product.model';
import { ProductService } from '../shared/services/product.service';
import { AddToCartComponent } from './addToCart/addToCart.component';
import { ImageSliderComponent } from './imageSlider/imageSlider.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    ImageSliderComponent
  ]
})
export class HomeComponent implements OnInit {

  //stores products fetched
  productList = new Observable<Product[]>();
  isLoading = true;
  //stores filtered products
  adidasProducts: Product[] = [];
  nikeProducts: Product[] = [];
  balanceProducts: Product[] = [];
  topRatedProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    //fetching products from db
    this.productService.fetchProduct();
    this.productList= this.productService.productList;
    //filtering brands
    this.productList.subscribe(products=>{
      for(let product of products){
        if(product.companyName === 'ADIDAS'){
          this.adidasProducts.push(product);
        }
        if(product.companyName === 'NIKE'){
          this.nikeProducts.push(product);
        }
        if(product.companyName === 'NEW BALANCE'){
          this.balanceProducts.push(product);
        }
      }
      for(let i=0; i<3; i++){
        this.topRatedProducts.push(products[i]);
      }
    })
    this.isLoading = false;
    //this.getAllProducts();
    let placesService = new google.maps.places.PlacesService(document.getElementById('map') as HTMLDivElement); // i.e. <div id="map"></div>

    const request = {
      placeId: 'ChIJX7YUPPrLxUcRV19YH_qKvac',
      fields: ['place_id']
    };

    placesService.getDetails(request, (data: any)=>{
      console.log(data);
    });
    //this.http.get('https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJhzd9NKqxxUcRRcSQDWGjils&key=AIzaSyAUtWscrUnwXe5o3S008Gd0Je05C6FxgEA')
    //.subscribe((data: any)=>{
    //  console.log(data);
    //})
  }
  //add product to cart
  addToCart(product: CartProduct) {
    product.noOfItems =1;
    this.productService.addToCart(product);
  }

  //opens dialog when (+)button is clickec
  openDialog(product: Product){
    this.dialog.open(AddToCartComponent, {
      data: product,
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '280px'
    });
  }
}
