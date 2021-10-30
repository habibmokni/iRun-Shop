import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Product } from '../shared/models/product.model';
import { Store } from '../shared/models/store.model';
import { ProductService } from '../shared/services/product.service';
import { StoreService } from '../shared/services/store.service';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductsComponent implements OnInit {
  variantIndex=0;
  sizes: number[]=[1];

  imageList = new FormArray([]);
  variants = new FormArray([]);

  form = new FormGroup({
    'companyName': new FormControl(),
    'modelNo': new FormControl(),
    'name': new FormControl(),
    'category': new FormControl(),
    'subCategory': new FormControl(),
    'price': new FormControl(),
    'variants': this.variants,
    'imageList': this.imageList
  });



  constructor(private productService: ProductService, private storeService: StoreService) {
    productService.fetchProduct();
   }

  ngOnInit(): void {
  }

  onAddImages(){
    const control = new FormControl(null);
    (<FormArray>this.form.get('imageList')).push(control);
  }
  onAddVariants(){

    const control = new FormGroup({
      'color': new FormControl(),
      'sizes': new FormArray([
        new FormControl()
      ]),
      'inStock': new FormArray([
        new FormControl()
      ])
    });
    (<FormArray>this.variants).push(control);
  }
  onAddSizes(index: number){
    this.sizes.push(1);
    const control = new FormControl();
    (<FormArray>this.variants.get(index+'.sizes')).push(new FormControl());
    (<FormArray>this.variants.get(index+'.inStock')).push(control);
  }
  onSubmit(){
    const product: Product = {
      id: Math.random()*100,
      companyName: this.form.get('companyName')?.value,
      modelNo: this.form.get('modelNo')?.value,
      name: this.form.get('name')?.value,
      category: this.form.get('category')?.value,
      subCategory: this.form.get('subCategory')?.value,
      imageList: this.form.get('imageList')?.value,
      price: this.form.get('price')?.value,
      variants: this.form.get('variants')?.value,
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
