import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA, inject, ChangeDetectionStrategy } from '@angular/core';

import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionPanel, MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { CartProduct } from 'src/app/shared/models/cartProduct.model';
import { Product } from 'src/app/shared/models/product.model';
import { User } from 'src/app/shared/models/user.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddToCartComponent implements OnInit {
  data = inject<Product>(MAT_DIALOG_DATA);
  private productService = inject(ProductService);
  private snackbarService = inject(SnackbarService);
  dialog = inject(MatDialog);
  private userService = inject(UserService);

  @ViewChild(MatExpansionPanel) expansionPanel!: MatExpansionPanel;
  noOfItems=1;
  size = 0;
  stock = 0;
  isSizeSelected=false;
  product: Product;
  user!: User;
  isLoaded =  false;


  constructor() {
      const data = this.data;
      const userService = this.userService;

      this.product = data;
      if(userService.user){
        this.user = this.userService.user;
      }
        userService.userSub.subscribe(()=>{
          this.user = userService.user;
          console.log(this.user.storeSelected);
          this.checkProductInStore();
        });
   }
  ngOnInit(): void {

    setTimeout(()=>{
      this.isLoaded = true;
    },10)
  }
  //triggers when size is selected
  onSizeSelect(size: number){
    this.size = size;
    this.isSizeSelected = true;
    if(this.user){
      this.checkProductInStore();
    }
  }

addToCart(product: Product){
  if(this.user){
    if(this.isSizeSelected && this.stock>0){
      this.onAddToCart(product);
    }else{
        //warning message if store does not have product
        if(this.stock === 0){
          this.snackbarService.info('Please change store as product is not available in selected store and online store');
        }else{
          this.snackbarService.info('Please select size of product');
        }
      }
  }else{
    if(this.isSizeSelected){
      this.onAddToCart(product);
    }
  }

}
//triggers when size is selected and checks if store has it or not
checkProductInStore(){
  setTimeout(()=>{
    for(let products of this.user.storeSelected.products){
      if(products.modelNo === this.product.modelNo){
        for(let i=0; i<products.variants[0].sizes.length; i++){
          if(products.variants[0].sizes[i] === this.size){
            this.stock = +products.variants[0].inStock[i];
            }
          }
        }
      }
    },1000)

  }

  onAddToCart(product: Product){
    const cartProduct: CartProduct = {
      productImage: product.variants[0].imageList[0],
      modelNo : product.modelNo,
      variantId: product.variants[0].variantId,
      noOfItems : 1,
      size : +this.size,
      vendor: product.companyName!,
      productName: product.name,
      price: product.price
    }
    this.productService.addToCart(cartProduct);
  }


}
