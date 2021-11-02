import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { CartProduct } from 'src/app/shared/models/cartProduct.model';
import { User } from 'src/app/shared/models/user.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AvailabilityComponent } from 'src/app/home/product-page/availability/availability.component';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  @ViewChild(MatExpansionPanel) expansionPanel!: MatExpansionPanel;
  @Output() dateSelected= new EventEmitter<Date>();

  @Input() shippingMethod!: FormGroup;
  selectedStore: {address: string, location: {lat: number, lng: number}} = {
    address: 'Address',
    location: {
      lat: 0,
      lng: 0
    }
  };

  cartProducts: CartProduct[];
  itemInStock: number[]=[];
  cartItemUnavailable: CartProduct[]=[];
  grandTotal!: number;
  date!: Date;

  times = [7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]
  days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  preBtn!: Element;
  user!: User;
  allItemsAvailable= false;
  isStoreSelected = false;

  calender: Date[]=[];
  constructor(private productService:  ProductService, private dialog: MatDialog, private userService: UserService) {
    const date= new Date();
    const day=date.getDate();
    const month=date.getMonth();
    const year=date.getFullYear();

    this.cartProducts = productService.getLocalCartProducts();
    for(let i=0; i<15; i++){
      this.calender.push(new Date(year,month,day+i))
    }
    if(userService.user){
      this.user = this.userService.user;
      this.isStoreSelected =true;
      this.checkProductsStock();
      for(let i=0; i<this.itemInStock.length; i++){
        if(this.itemInStock[i] === 0){
          this.allItemsAvailable =false;
          this.cartItemUnavailable.push(this.cartProducts[i]);
        }else{
          this.allItemsAvailable =true;
        }
      }
    }
      userService.userSub.subscribe(()=>{
        this.user = userService.user;
        this.isStoreSelected = true;
        this.cartItemUnavailable = [];
        if(this.user){
          this.checkProductsStock();
        for(let i=0; i<this.itemInStock.length; i++){
          if(this.itemInStock[i] === 0){
            this.allItemsAvailable =false;
            this.cartItemUnavailable.push(this.cartProducts[i]);
          }else{
            this.allItemsAvailable =true;
          }
        }
        }

      });

   }

  ngOnInit(): void {

  }
  onDaySelect(index: number, date: Date){
    this.date = date;
    this.dateSelected.emit(date);
    const buttonList = document.getElementsByClassName('button');
    buttonList[index].classList.add("active");
    if(this.preBtn){
      this.preBtn.classList.remove("active");
    }
    this.preBtn = buttonList[index];
  }

  onOpenDialog(){
    this.dialog.open(AvailabilityComponent, {
      data: {
        call: 'checkout'
      }
    });
  }

  checkProductsStock(){
    this.itemInStock= [];
    for(let product of this.cartProducts){
      for(let storeProduct of this.user.storeSelected.products){
        if(storeProduct.modelNo === product.modelNo){
          for(let i=0; i<storeProduct.variants[0].sizes.length; i++){
            if(storeProduct.variants[0].sizes[i]===product.size){
              this.itemInStock.push(+storeProduct.variants[0].inStock[i]);
            }
          }
        }
      }
      this.grandTotal += (product.price*product.noOfItems!);
    }
    this.productService.orderPrice=this.grandTotal;
  }

  removeProductsUnavailable(){
    for(let i=0; i<this.itemInStock.length; i++){
      if(this.itemInStock[i] === 0){
        this.productService.removeLocalCartProduct(this.cartProducts[i]);
      }
    }
    this.allItemsAvailable=true
  }
}
