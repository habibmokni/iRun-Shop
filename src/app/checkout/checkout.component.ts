import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Order } from '../shared/models/order.model';
import { ProductService } from '../shared/services/product.service';
import { StoreService } from '../shared/services/store.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SnackbarService } from '../shared/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { Store } from '../shared/models/store.model';
import { CartProduct } from '../shared/models/cartProduct.model';
import { Product } from '../shared/models/product.model';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  billingSteps=0;
  order!: Order;
  cartProducts: CartProduct[] = [];
  user: User | null = null;
  stores: Store[] = [];
  storeLocations: any[] = [];
  preBtn!: Element;
  isClickNCollect = true;

  step = 0;

  shippingMethod = new FormGroup({
    type: new FormControl('Click & Collect'),
    pickupDate: new FormControl(null, [Validators.required]),
    shippingAddress: new FormControl('', [Validators.required]),
    selectedTime: new FormControl('No time selected')
  })


  firstFormGroup = new FormGroup({
    shippingMethod: this.shippingMethod
  });

  billing= new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phoneNo: new FormControl('', [Validators.required]),
    address1: new FormControl('', [Validators.required]),
    address2: new FormControl('', [Validators.required])
  })
  secondFormGroup = this._formBuilder.group({
    billing: this.billing
  });
  paymentMethod= new FormGroup({
    paymentOption: new FormControl('', [Validators.required])
  })
  thirdFormGroup = this._formBuilder.group({
    paymentMethod: this.paymentMethod
  });

  storeAddress!: string;

  orderPrice: number = 0;
  onlineProducts: Product[] = [];
  onlineStoreStock: number[] = [];
  cartItemUnavailable: CartProduct[] = [];
  cncAllItemsAvailable = true;
  onlineAllItemsAvailable = true;

  constructor(
    private _formBuilder: FormBuilder,
    private db: AngularFirestore,
    private productService: ProductService,
    private storeService: StoreService,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private dialog: MatDialog
    ) {
      if(userService.user){
        this.user = userService.user;
      }
      userService.userSub.subscribe(()=>{
        this.user = userService.user;
        this.productService.fetchProduct();
        this.productService.productList.subscribe(products=>{
        this.onlineProducts = products;
      })
      });
      this.storeLocations = this.storeService.storeLocations;
    this.cartProducts = productService.getLocalCartProducts();
    this.storeService.selectedStore.subscribe(store=>{
      this.storeAddress = store.address;
      console.log(store.address);
    });
    this.storeService.store.subscribe(storeList=>{
      for(let store of storeList){
        this.stores.push(store);
      }
    })
  }
  ngOnInit(): void {
    this.cartProducts = this.productService.getLocalCartProducts()
    if(!this.productService.productList){
      this.productService.fetchProduct();
    }
    this.productService.productList.subscribe(products=>{
      this.onlineProducts = products;
      this.checkItemsInOnlineStore();
    });

    this.productService.cartProductsChanged.subscribe(newProducts=>{
      this.cartProducts = newProducts;
      this.checkItemsInOnlineStore();
      this.orderPrice = 0;
      for(let products of this.cartProducts){
        this.orderPrice += products.price*products.noOfItems!;
      }
    });
    for(let products of this.cartProducts){
      this.orderPrice += products.price*products.noOfItems!;
    }
    if(this.user){
      this.shippingMethod.patchValue({
        'shippingAddress': this.user.storeSelected.address
      });
    }
  }

  onSubmit(){
    this.order = {
      orderId: Math.floor(Math.random()*100000000),
      billingDetails: {
        name: this.secondFormGroup.get('billing.name')?.value,
        email: this.secondFormGroup.get('billing.email')?.value,
        phoneNo: this.secondFormGroup.get('billing.phoneNo')?.value,
        address1: this.secondFormGroup.get('billing.address1')?.value,
        address2: this.secondFormGroup.get('billing.address2')?.value
      },
      productsOrdered: this.productService.getLocalCartProducts(),
      storeLocation: {
        id : 2020,
        address: this.firstFormGroup.get('shippingMethod.shippingAddress')?.value
      },
      pickupDate: this.firstFormGroup.get('shippingMethod.pickupDate')?.value,
      pickupType: this.firstFormGroup.get('shippingMethod.type')?.value,
      pickupTime: this.firstFormGroup.get('shippingMethod.selectedTime')?.value,
      paymentOption: this.thirdFormGroup.get('paymentMethod.paymentOption')?.value,
      orderPrice: this.orderPrice
    }
  }
  onOrderConfirmation(){
    this.db.collection<Order>('orderList').add(this.order);
    this.snackbarService.success('Order placed Successfully');
    this.dialog.open(OrderSuccessComponent);
    this.productService.removeAllLocalCartProduct();
  }

  dateSelected(date: Date){
    console.log(date);
    this.shippingMethod.patchValue({
      'pickupDate': date
    });
  }

  timeSelected(time: string){
    this.shippingMethod.patchValue({
      'selectedTime': time
    })
  }
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
  onProductsToRemove(cartItems: CartProduct[]){
    for(let item of cartItems){
      this.productService.removeLocalCartProduct(item);
    }
  }
  cncItemsAvailable(value: any){
    this.cncAllItemsAvailable = value;
    console.log(this.cncAllItemsAvailable);
  }

  selectDelivery(type: string,  index: number){
    this.shippingMethod.patchValue({
      'type': type
    });
    if(index===1){
      this.isClickNCollect = false;
    }else{
      this.isClickNCollect = true;
    }

  }

  checkItemsInOnlineStore(){
    this.cartItemUnavailable = [];
    this.onlineStoreStock = [];
    setTimeout(() => {
      console.log(this.onlineProducts);
      for(let product of this.cartProducts){
        for(let onlineProduct of this.onlineProducts){
          if(onlineProduct.modelNo === product.modelNo){
            for(let variant of onlineProduct.variants){
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
          console.log(this.cartItemUnavailable);
        }
      }
    }, 100);

  }
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

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
