import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Product } from 'src/app/shared/models/product.model';
import { User } from 'src/app/shared/models/user.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AvailabilityComponent } from '../product-page/availability/availability.component';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent implements OnInit {
  @ViewChild(MatExpansionPanel) expansionPanel!: MatExpansionPanel;
  noOfItems=1;
  size = 0;
  isSizeSelected=false;
  preBtn!: Element;
  product: Product;
  user!: User;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AddToCartComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Product,
    private productService: ProductService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private userService: UserService
    ) {
      this.product = data;
      if(userService.user){
        this.user = this.userService.user;
      }
        userService.userSub.subscribe(()=>{
          this.user = userService.user;
          console.log(this.user.storeSelected);
        });
   }
  ngOnInit(): void {
  }

  onSizeSelect(size: number){
    this.size = size;
  }

onRemoveItem(){
  if(this.noOfItems>1){
    this.noOfItems--;
  }
}
onAddItem(){
  this.noOfItems++;
}

addToCart(product: Product){
  product.productImage = product.imageList[0];
  product.color = product.variants[0].color;
  product.noOfItems = this.noOfItems;
  product.size = this.size;
  this.productService.addToCart(product);
  this._bottomSheetRef.dismiss();
}



}
