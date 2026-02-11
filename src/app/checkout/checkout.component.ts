import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Order } from '../shared/models/order.model';
import { ProductService } from '../shared/services/product.service';
import { StoreService } from '../shared/services/store.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SnackbarService } from '../shared/services/snackbar.service';
import { OrderSuccessComponent } from './orderSuccess/order-success.component';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { Store } from '../shared/models/store.model';
import { CartProduct } from '../shared/models/cartProduct.model';
import { Product } from '../shared/models/product.model';
import { BillingDetailsComponent } from './billingDetails/billingDetails.component';
import { PaymentMethodsComponent } from './paymentMethods/paymentMethods.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatDialogModule,
    BillingDetailsComponent,
    PaymentMethodsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckoutComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private db = inject(AngularFirestore);
  private productService = inject(ProductService);
  private storeService = inject(StoreService);
  private snackbarService = inject(SnackbarService);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  //checks for delivery type and products avalability
  isClickNCollect = true;
  cncAllItemsAvailable = true;
  onlineAllItemsAvailable = true;
  //for storing necessary data
  user: User | null = null;
  stores: Store[] = [];
  storeLocations: any[] = [];
  cartProducts: CartProduct[] = [];
  cartItemUnavailable: CartProduct[] = [];
  onlineProducts: Product[] = [];
  order!: Order;
  //for button style
  preBtn!: Element;
  preDate!: Date;
  linear = true;
  //for storing current address value
  storeAddress: string = '';
  //holds order price
  orderPrice: number = 0;
  step: number = 0;
  //stores stock of online store
  onlineStoreStock: number[] = [];
  //first step of checkout
  shippingMethod = new FormGroup({
    type: new FormControl('Click & Collect'),
    pickupDate: new FormControl<Date | null>(null, [Validators.required]),
    shippingAddress: new FormControl(''),
    selectedTime: new FormControl('No time selected')
  });
  //second step of checkout
  billing= new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phoneNo: new FormControl('', [Validators.required]),
    address1: new FormControl('', [Validators.required])
  });
  //sub step in 2nd step (billing)
  paymentMethod= new FormGroup({
    paymentOption: new FormControl('', [Validators.required])
  });

  firstFormGroup = new FormGroup({
    shippingMethod: this.shippingMethod
  });

  secondFormGroup = this._formBuilder.group({
    billing: this.billing
  });

  thirdFormGroup = this._formBuilder.group({
    paymentMethod: this.paymentMethod
  });

  constructor()
    {
      const productService = this.productService;
      const userService = this.userService;

      if(userService.user){
        this.user = userService.user;
      }
      //observes change in user store
      userService.userSub.subscribe(()=>{
        this.user = userService.user;
        this.productService.fetchProduct();
        this.productService.productList.subscribe(products=>{
          this.onlineProducts = products;
        });
      });
      //fetching store locations
      this.storeLocations = this.storeService.storeLocations;
      this.cartProducts = productService.getLocalCartProducts();
      this.storeService.selectedStore.subscribe(store=>{
        this.storeAddress = store.address;
      });
      //subscribe to store changes
      this.storeService.store.subscribe(storeList=>{
        for(let store of storeList){
          this.stores.push(store);
        }
      });
    }
  ngOnInit(): void {
    //fetching cart and online store products
    this.cartProducts = this.productService.getLocalCartProducts();
    this.checkItemsInOnlineStore();
    //fetch products if not fetched before by the app
    if(!this.productService.productList){
      this.productService.fetchProduct();
    }
    this.productService.productList.subscribe(products=>{
      this.onlineProducts = products;
      this.checkItemsInOnlineStore();
    });
    //triggers everytime if cart product changes
    this.productService.cartProductsChanged.subscribe(newProducts=>{
      if(newProducts.length>0){
        this.cartProducts = newProducts;
        this.checkItemsInOnlineStore();
        this.orderPrice = 0;
        for(let products of this.cartProducts){
          this.orderPrice += products.price*products.noOfItems;
        }
      }
    });
    //calculating order price
    for(let products of this.cartProducts){
      this.orderPrice += products.price*products.noOfItems;
    }
    //checks if user has store preference
    if(this.user){
      this.shippingMethod.patchValue({
        'shippingAddress': this.user.storeSelected.address
      });
    }
  }
  //prepares the order for user confirmation
  onSubmit(){
    this.order = {
      //assign random id to order
      orderId: Math.floor(Math.random()*100000000),
      billingDetails: {
        name: this.secondFormGroup.get('billing.name')!.value,
        email: this.secondFormGroup.get('billing.email')!.value,
        phoneNo: this.secondFormGroup.get('billing.phoneNo')!.value,
        address1: this.secondFormGroup.get('billing.address1')!.value
      },
      productsOrdered: this.productService.getLocalCartProducts(),
      storeLocation: {
        id : 2020,
        address: this.firstFormGroup.get('shippingMethod.shippingAddress')!.value
      },
      pickupDate: this.firstFormGroup.get('shippingMethod.pickupDate')!.value,
      pickupType: this.firstFormGroup.get('shippingMethod.type')!.value,
      pickupTime: this.firstFormGroup.get('shippingMethod.selectedTime')!.value,
      paymentOption: this.thirdFormGroup.get('paymentMethod.paymentOption')!.value,
      orderPrice: this.orderPrice
    }
  }
  //adds order to db on order confirmation
  onOrderConfirmation(){
    this.db.collection<Order>('orderList').add(this.order);
    this.snackbarService.success('Order placed Successfully');
    this.dialog.open(OrderSuccessComponent);
    this.productService.removeAllLocalCartProduct();
    this.cartProducts = [];
  }
  //fetches date from cnc package
  dateSelected(date: Date){
    this.shippingMethod.patchValue({
      'pickupDate': date
    });
  }
  //fetches time from cnc package
  timeSelected(time: string){
    this.shippingMethod.patchValue({
      'selectedTime': time
    })
  }
  //runs when store is changed by the user
  onStoreChange(store: Store){
    this.user = {
      name: 'Anonymous',
      storeSelected: store
    };
    this.shippingMethod.patchValue({
      'shippingAddress': store.address
    });
    this.userService.updateSelectedStore(this.user);
  }
  //removes cnc unavailable products
  onProductsToRemove(cartItems: CartProduct[]){
    for(let item of cartItems){
      this.productService.removeLocalCartProduct(item);
    }
  }
  //fetches the emited value from cnc package
  cncItemsAvailable(value: any){
    this.cncAllItemsAvailable = value;

  }
  //selects delivery type
  selectDelivery(type: string,  index: number){
    this.shippingMethod.patchValue({
      'type': type
    });
    if(index===1){
      this.isClickNCollect = false;
      this.shippingMethod.patchValue({
        pickupDate: new Date()
      });
    }else{
      this.isClickNCollect = true;
      this.shippingMethod.patchValue({
        pickupDate: null
      });
    }
  }
  //checks item are available in online store or not
  checkItemsInOnlineStore(){
    this.cartItemUnavailable = [];
    this.onlineStoreStock = [];
    for(let product of this.cartProducts){
      for(let onlineProduct of this.onlineProducts){
        //checks if online product modelNo matches to cart products modelNo
        if(onlineProduct.modelNo === product.modelNo){
          for(let variant of onlineProduct.variants){
            //checks if variantId of online store matches that of cart product
            if(variant.variantId === product.variantId){
              for(let i=0; i<variant.sizes.length; i++){
                if(+variant.sizes[i] === product.size){
                  this.onlineStoreStock.push(+variant.inStock[i]);
                }
              }
            }
          }
        }
      }
    }
    for(let i=0; i<this.onlineStoreStock.length; i++){
      if(this.onlineStoreStock[i] === 0){
        this.onlineAllItemsAvailable =false;
        this.cartItemUnavailable.push(this.cartProducts[i]);
      }
    }
  }
  //removes unavailable products when home delivery selected
  removeProductsUnavailable(){
    for(let cartProduct of this.cartItemUnavailable){
      this.productService.removeLocalCartProduct(cartProduct);
    }
    if(this.isClickNCollect){
      this.cncAllItemsAvailable = true;
    }else{
      this.onlineAllItemsAvailable=true;
    }
  }
  //for expansion panel of billing step
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    if(this.secondFormGroup.valid){
      this.step++;
    }else{
      this.snackbarService.info('Please enter billing details to proceed further');
    }
  }

  prevStep() {
    this.step--;
  }
  onCNCNext(){
    if(this.shippingMethod.invalid){
      this.snackbarService.info("Please select date to proceed");
    }
  }
  onDeliveryNext(){
    if(this.billing.invalid){
      this.snackbarService.info("Please enter all the fields of delivery");
    }
  }
}
