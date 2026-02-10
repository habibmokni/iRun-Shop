import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../shared/models/product.model';
import { Store } from '../shared/models/store.model';
import { ProductService } from '../shared/services/product.service';
import { StoreService } from '../shared/services/store.service';

@Component({
  selector: 'app-addProducts',
  templateUrl: './addProducts.component.html',
  styleUrls: ['./addProducts.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class AddProductsComponent implements OnInit {
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
  //  'imageList': this.imageList
  });



  constructor(private productService: ProductService, private storeService: StoreService) {
    productService.fetchProduct();

   }

  ngOnInit(): void {
    /*this.productService.productList.subscribe(products=>{
      this.productList = products;
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
      console.log(this.adidasProducts);
      let newSameProduct!: Product;
      for(let i=0; i<this.balanceProducts.length; i++){
        this.nikeProducts = this.adidasProducts;
        const model = this.nikeProducts[i].modelNo?.split('-');
        if(model[0] === 'FZ1917'){
          if(!newSameProduct){
            newSameProduct = {
              id: Math.floor(Math.random()*100000),
              name: this.nikeProducts[i].name,
              modelNo: model[0],
              companyName: this.nikeProducts[i].companyName,
              category: this.nikeProducts[i].category,
              subCategory: this.nikeProducts[i].subCategory,
              imageList: [],
              price: this.nikeProducts[i].price,
              variants: [{
                variantId: model[1],
                imageList: this.nikeProducts[i].imageList,
                sizes : this.nikeProducts[i].variants[0].sizes,
                inStock: this.nikeProducts[i].variants[0].inStock
              }]
          }
          }else {
            newSameProduct.variants.push({
              variantId: model[1],
                imageList: this.nikeProducts[i].imageList,
                sizes : this.nikeProducts[i].variants[0].sizes,
                inStock: this.nikeProducts[i].variants[0].inStock
            });
          }
        }
      }
      setTimeout(()=>{
        console.log(newSameProduct); //FZ1917 FY0400
        //this.productService.addNewProducts(newSameProduct)
      },2000)
    });**/
    //this.storeService.store.subscribe(storeList=>{
    //  for(let product of storeList[0].products){
    //    this.productService.addNewProducts(product);
    //  }
    //})
    console.log( this.productService.fetchNewProducts());
    //const products: Product[] = this.productService.fetchNewProducts();
    //this.productService.addProductsToDatabase(products);
    //this.storeService.updateProducts(products);
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
//    this.productService.addProductToDatabase(product);
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
  //    this.storeService.addStoreToDatabase(store);
  //this.storeService.updateProducts(products);
    },5000)

  }

}
