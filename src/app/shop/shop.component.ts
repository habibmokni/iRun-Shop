import { Component, OnInit } from '@angular/core';
import { MatBottomSheet} from '@angular/material/bottom-sheet';
import { Observable } from 'rxjs';
import { CartProduct } from '../shared/models/cartProduct.model';
import { Product } from '../shared/models/product.model';
import { ProductService } from '../shared/services/product.service';
import { AddToCartComponent } from './add-to-cart/add-to-cart.component';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  productList = new Observable<Product[]>();
  isLoading = true;
  adidasProducts: Product[] = []
  nikeProducts: Product[] = []
  balanceProducts: Product[] = []

  constructor(
    private productService: ProductService,
    private _bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.productService.fetchProduct();
    this.productList= this.productService.productList;
    this.productList.subscribe(products=>{
      this.isLoading = false;
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
    })
    this.isLoading = false;
    //this.getAllProducts();
  }

  addToCart(product: CartProduct) {
    product.noOfItems =1;
    this.productService.addToCart(product);
  }
  openBottomSheet(product: Product){
    this._bottomSheet.open(AddToCartComponent, {
      data: product
    });
  }
}
