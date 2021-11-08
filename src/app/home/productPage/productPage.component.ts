import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatRadioChange } from '@angular/material/radio';
import { ActivatedRoute } from '@angular/router';
import { CheckAvailabilityComponent } from '@habibmokni/cnc';


import { Observable } from 'rxjs';
import { CartProduct } from 'src/app/shared/models/cartProduct.model';
import { User } from 'src/app/shared/models/user.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Product } from '../../shared/models/product.model';


@Component({
  selector: 'app-productPage',
  templateUrl: './productPage.component.html',
  styleUrls: ['./productPage.component.css']
})
export class ProductPageComponent implements OnInit {
  //instance of DOM element MatExpansionPanel
  @ViewChild(MatExpansionPanel) expansionPanel!: MatExpansionPanel;
  //stores current variant info
  variant!: {
    variantId: string,
    imageList: string[],
    sizes: number[],
    inStock: number[]
  };
  //for toggle expansion panel
  panelOpenState = false;
  sub: any;
  product = new Observable<Product[]>();
  size: number = 0;
  user!: User;
  stock: number = 0;
  selectedProduct!: Product;

  productImage!: string;
  isSizeSelected = false;
  grandTotal: number = 0;
  //for desktop image
  mainImage: string = '';
  //maps api key
  //apiKey = 'AIzaSyCKj-l5U2bLY3wEx-9DN1owQhs3a9iJ-Uw';
  preBtn!: Element;
  fee: number = 0;
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private productService: ProductService,
    public userService: UserService,
    private snackBar: SnackbarService
    ){
      if(userService.user){
        this.user = this.userService.user;
      }
      userService.userSub.subscribe(()=>{
        this.user = userService.user;
        this.checkProductInStore();
      });

    }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      const id: string = params.id; //extracting id from route url
      this.getProductDetail(id); //fetching product from db
      this.product= this.productService.product;
      this.product.subscribe(product=>{
        this.selectedProduct = product[0];
        this.variant = product[0].variants[0];
        this.mainImage = this.variant.imageList[0];
        this.productImage = this.mainImage;
      })
    });
  }
  //code to find similar products
  /*getSimilarProducts(id: string){
    const productModel = id.split('-');
    this.productService.productList.subscribe(products=>{
      for(let i=0; i<products.length; i++){
        const model = products[i].modelNo?.split('-');
        if(model![0] === productModel[0]){
          this.similarProducts.push(products[i]);
        }
      }
      console.log(this.similarProducts);
    });
  }*/
  //method to fetch product from db
  getProductDetail(id: string) {
    this.productService.getProductById(id);
  }
  //triggers when check avaialbility button is pressed
  openDialog(product: Product) {
    this.dialog.open(CheckAvailabilityComponent, {
      data: {                                     //passing data to cnc package CheckAvailability component
        call: 'product',
        size: this.size,
        modelNo: product.modelNo!,
        sizes: product.variants[0].sizes,
        variantId: product.variants[0].variantId
      },
      maxWidth: '100vw',
      maxHeight: '100vh'
    });
  }
  //adds product to cart if product is available in selected store or online store and size is selected
  addToCart(product: Product){
    if(this.isSizeSelected && this.stock>0){
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
    }else{
      //warning message if store does not have product
      if(this.stock === 0){
        this.snackBar.info('Please change store as product is not available in selected store and online store');
      }else{
        this.snackBar.info('Please select size of product');
      }
    }

  }
  //for desktop styling
  onImageSelect(image : string, index: number){
    this.mainImage = image;

  }
  //triggers when variant is elected
  variantSelect(index: number, variant: any){
    //this.productService.getProductById(modelNo);
    this.variant = variant;
    this.mainImage = this.variant.imageList[0];
    this.productImage = this.mainImage;
    this.selectedProduct.variants = [];
    this.selectedProduct.variants.push(this.variant);
  }
  //triggers on size select
  sizeSelected(size: any){
    this.size = size;
    this.isSizeSelected = true;
    this.checkProductInStore();
  }
  checkAvailability(product: Product){
    window.scrollTo(0,0);
    this.openDialog(product);
  }
  //tiggers when size is selected and checks if it is available in selected store or not
  checkProductInStore(){
    setTimeout(()=>{
      for(let products of this.user.storeSelected.products){
        if(products.modelNo === this.selectedProduct.modelNo){
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
