import { Component, OnInit, inject, ChangeDetectionStrategy, viewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule } from '@angular/material/bottom-sheet';
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
import { AvailabilityComponent } from '../product-page/availability/availability.component';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    MatBottomSheetModule,
    MatDialogModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule
]
})
export class AddToCartComponent implements OnInit {
  data = inject<Product>(MAT_DIALOG_DATA);
  private productService = inject(ProductService);
  private snackbarService = inject(SnackbarService);
  dialog = inject(MatDialog);
  private userService = inject(UserService);

  readonly expansionPanel = viewChild.required(MatExpansionPanel);
  noOfItems=1;
  size = 0;
  stock = 0;
  isSizeSelected=false;
  preBtn!: Element;
  product: Product;
  user!: User;


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
  }

  onSizeSelect(size: number){
    this.size = size;
    this.isSizeSelected = true;
    this.checkProductInStore();
  }


addToCart(product: Product){
  if(this.isSizeSelected){
    const cartProduct: CartProduct = {
      productImage: product.imageList?.[0] ?? '',
      modelNo : product.modelNo,
      variantId: product.variants[0].variantId,
      noOfItems : 1,
      size : +this.size,
      vendor: product.companyName!,
      productName: product.name,
      price: product.price
    }
    this.productService.addToCart(cartProduct);
  }else{
    if(this.stock === 0){
      this.snackbarService.info('Please change store as product is not available in selected store');
    }else{
      this.snackbarService.info('Please select size of product');
    }

  }
}
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

}
