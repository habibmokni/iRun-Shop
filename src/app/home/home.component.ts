import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CartProduct } from '../shared/models/cartProduct.model';
import { Product } from '../shared/models/product.model';
import { ProductService } from '../shared/services/product.service';
import { AddToCartComponent } from './addToCart/addToCart.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
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
    private dialog: MatDialog
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
