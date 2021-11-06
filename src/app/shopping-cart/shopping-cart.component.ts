import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CartProduct } from '../shared/models/cartProduct.model';
import { Product } from '../shared/models/product.model';
import { User } from '../shared/models/user.model';
import { ProductService } from '../shared/services/product.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { UserService } from '../shared/services/user.service';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  // Not Found Message
  messageTitle = "No Products Found in Cart";
  messageDescription = "Please add Products to Cart";
  user!: User;

  cartProducts: CartProduct[] = [];

  totalValue= 0;

  paymentPartner: {name:string, logo: string}[] = [{name:'MasterCard', logo: '../../assets/images/logos/mastercard-logo.png'}, {name:'Visa', logo: '../../assets/images/logos/Visa-logo.png'}, {name:'Paypal', logo: '../../assets/images/logos/paypal-logo.jpg'}];

  itemInStock: number[] = [];
  onlineProducts: Product[] = [];
  onlineStoreStock: number[] = [];

  grandtotal = 0;

  constructor(private productService: ProductService, private router: Router, private userService: UserService, private snackbarService: SnackbarService) {
    if(userService.user){
      this.user = this.userService.user;
    }
      userService.userSub.subscribe(()=>{
        this.user = userService.user;
        console.log(this.user.storeSelected);
      });
      this.productService.fetchProduct();
      this.productService.productList.subscribe(products=>{
        this.onlineProducts = products;
        if(this.user){
          this.checkProductsStock();
        }
      })
   }

  ngOnInit(): void {
    this.getCartProduct();
  }
  onAddItem(index: number, product: CartProduct){
    console.log(this.itemInStock);
    if(this.cartProducts[index].noOfItems>0){
      if(this.cartProducts[index].noOfItems<this.itemInStock[index]){
        this.cartProducts[index].noOfItems++;
        this.grandtotal=this.grandtotal+(+this.cartProducts[index].price);
        this.productService.updateNoOfItemsOfProduct(product);
      }
    }
  }
  onRemoveItem(index: number, product: CartProduct){

    if(this.cartProducts[index].noOfItems===1){
      this.grandtotal=this.grandtotal-(+this.cartProducts[index].price);
      this.removeCartProduct(product);
      if(this.user){
        this.checkProductsStock();
      }
    }else{
      if(this.cartProducts[index].noOfItems!>1){
        this.cartProducts[index].noOfItems!--;
        this.grandtotal=this.grandtotal-(+this.cartProducts[index].price);
        this.productService.updateNoOfItemsOfProduct(product);
      }
    }

  }

  removeCartProduct(product: CartProduct) {
    this.productService.removeLocalCartProduct(product);

    // Recalling
    this.getCartProduct();
  }

  getCartProduct() {
    this.cartProducts = this.productService.getLocalCartProducts();
  }
  onSubmit(){
    /*for(let i=0; i<this.itemInStock.length; i++){
      if(this.itemInStock[i] === 0){
        this.productService.allItemsInStock=false;
      }else{
        this.productService.allItemsInStock=true;
      }


    if(this.productService.allItemsInStock==true){
      this.productService.orderPrice = this.totalValue;
      this.router.navigate(["/checkout"]);
    }else{
      this.snackbarService.info("Some items are out of stock in current store. Please change store or remove items out of stock!");
    }*/
    if(this.cartProducts.length>0){
      this.productService.orderPrice = this.totalValue;
      this.router.navigate(["/checkout"]);
    }else {
      this.snackbarService.info('Please add products to cart!');
    }

  }

  checkProductsStock(){
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
      this.grandtotal += (product.price*product.noOfItems);
    }
    setTimeout(() => {
      console.log(this.onlineProducts);
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
    }, 100);

    console.log(this.onlineStoreStock);
  }

}
