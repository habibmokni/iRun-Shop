import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartProduct } from '../shared/models/cartProduct.model';
import { Product } from '../shared/models/product.model';
import { User } from '../shared/models/user.model';
import { ProductService } from '../shared/services/product.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-shoppingCart',
  templateUrl: './shoppingCart.component.html',
  styleUrls: ['./shoppingCart.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
]
})
export class ShoppingCartComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private userService = inject(UserService);
  private snackbarService = inject(SnackbarService);


  messageTitle = "No Products Found in Cart";
  messageDescription = "Please add Products to Cart";

  user!: User;
  cartProducts: CartProduct[] = [];
  totalValue= 0;
  grandtotal = 0;

  itemInStock: number[] = [];
  onlineProducts: Product[] = [];
  onlineStoreStock: number[] = [];


  constructor()
    {
      const userService = this.userService;

      //check if user already exists
      if(userService.user){
        this.user = this.userService.user;
      }
      //observes the user changes
      userService.userSub.subscribe(()=>{
        this.user = userService.user;
      });
      //fetching products and subscribing to realtime changes
      this.productService.fetchProduct();
      this.productService.productList.subscribe(products=>{
        this.onlineProducts = products;
        this.checkProductsStock();
      });
    }

  ngOnInit(): void {
    this.getCartProduct();
    for(let product of this.cartProducts){
      this.grandtotal += (product.price*product.noOfItems);
    }
  }
  //function to increment noOfitems of a product
  onAddItem(index: number, product: CartProduct){
    if(this.cartProducts[index].noOfItems>0){
      if(this.cartProducts[index].noOfItems<this.itemInStock[index] || this.cartProducts[index].noOfItems<this.onlineStoreStock[index]){
        this.cartProducts[index].noOfItems++;
        this.grandtotal=this.grandtotal+(+this.cartProducts[index].price);
        this.productService.updateNoOfItemsOfProduct(product);
      }
    }
  }
  //function to decrement noOfItems of a product
  onRemoveItem(index: number, product: CartProduct){
    if(this.cartProducts[index].noOfItems===1){     //if noOfItem is equal to 0 product removed from cart
      this.grandtotal=this.grandtotal-(+this.cartProducts[index].price);
      this.removeCartProduct(product);
      if(this.user){
        this.checkProductsStock();
      }
    }else{
      if(this.cartProducts[index].noOfItems>1){     //if noOfItem is greater than 1 than decremented by 1
        this.cartProducts[index].noOfItems--;
        this.grandtotal=this.grandtotal-(+this.cartProducts[index].price);
        this.productService.updateNoOfItemsOfProduct(product);
      }
    }
  }
  //function to remove cartProduct
  removeCartProduct(product: CartProduct) {
    this.productService.removeLocalCartProduct(product);

    // Recalling
    this.getCartProduct();
  }
  //fetching cart products from product service
  getCartProduct() {
    this.cartProducts = this.productService.getLocalCartProducts();
  }
  //called when checkout button is pressed
  onSubmit(){
    if(this.cartProducts.length>0){
      this.productService.orderPrice = this.totalValue;
      this.router.navigate(["/checkout"]);
    }else {
      this.snackbarService.info('Please add products to cart!');
    }
  }
  //to check whether product is available in physical and online store
  checkProductsStock(){
    //physical store check
    if(this.user){
      for(let product of this.cartProducts){
        for(let storeProduct of this.user.storeSelected.products){
          if(storeProduct.modelNo === product.modelNo){
            for(let variant of storeProduct.variants){
              if(variant.variantId === product.variantId){
                for(let i=0; i<variant.sizes.length; i++){
                  if(+variant.sizes[i] === product.size){
                    this.itemInStock.push(+variant.inStock[i]);
                  }
                }
              }
            }
          }
        }
      }
    }

    //online store check
    for(let product of this.cartProducts){
      for(let onlineProduct of this.onlineProducts){
        if(onlineProduct.modelNo === product.modelNo){
          for(let variant of onlineProduct.variants){
            if(variant.variantId === product.variantId){
              for(let i=0; i<variant.sizes.length; i++){
                if(+variant.sizes[i] === +product.size){
                  this.onlineStoreStock.push(+variant.inStock[i]);
                }
              }
            }
          }
        }
      }
    }
  }

}
