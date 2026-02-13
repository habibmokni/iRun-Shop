import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';

import { ReactiveFormsModule, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../products/types/product.types';
import { Store } from '../../stores/types/store.types';
import { ProductService } from '../../products/services/product.service';
import { StoreService } from '../../stores/services/store.service';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class AddProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private storeService = inject(StoreService);

  //dummy component to add products to db
  productList: Product[] = [];
  adidasProducts: Product[] = [];
  balanceProducts: Product[] = [];
  nikeProducts: Product[] = [];

  newAdidasProducts: Product[] = [];

  variantIndex=0;
  sizes: number[]=[1];

  imageList: string[] = [];
  variants = new FormArray([]);

  form = new FormGroup({
    'companyName': new FormControl(),
    'modelNo': new FormControl(),
    'name': new FormControl(),
    'category': new FormControl(),
    'subCategory': new FormControl(),
    'price': new FormControl(),
    'variants': this.variants,
  });


  constructor() {
    const productService = this.productService;
    productService.fetchProduct();
  }

  ngOnInit(): void {
    console.log( this.productService.fetchNewProducts());
  }

  onAddImages(){
    const control = new FormControl(null);
    (<FormArray><unknown>this.form.get('imageList')).push(control);
  }
  onAddVariants(){
    const control = new FormGroup({
      'variantId': new FormControl(),
      'sizes': new FormArray([
        new FormControl()
      ]),
      'inStock': new FormArray([
        new FormControl()
      ]),
      'imageList': new FormArray([
        new FormControl()
      ])
    });
    (<FormArray><unknown>this.variants).push(control);
  }
  onAddSizes(index: number){
    this.sizes.push(1);
    const control = new FormControl();
    (<FormArray>this.variants.get(index+'.sizes')).push(new FormControl());
    (<FormArray>this.variants.get(index+'.inStock')).push(control);
  }
  onSubmit(){
    const product: Product = {
      id: Math.floor(Math.random()*100),
      companyName: this.form.get('companyName')?.value,
      modelNo: this.form.get('modelNo')?.value,
      name: this.form.get('name')?.value,
      category: this.form.get('category')?.value,
      subCategory: this.form.get('subCategory')?.value,
      imageList: [],
      price: this.form.get('price')?.value,
      variants: this.form.get('variants')!.value,
    }
    console.log(product);

    var products: Product[] = [];
    this.productService.productList.subscribe(productList=>{
      for(let product of productList){
        products.push(product);
      }
    })

    var store: Store = {
      address: 'Kettwiger Straße 40 45127 Essen',
      id: "2020",
      isDefaultStore: false,
      location: {
        lat: 51.45617873095872,
        lng: 7.013075711675198
      },
      name: "DEICHMANN",
      openingTime: {
        open: "10a.m",
        close: "10p.m"
      },
      products: products
    }
    setTimeout(()=>{
    },5000)
  }
}
