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
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  @ViewChild(MatExpansionPanel) expansionPanel!: MatExpansionPanel;

  panelOpenState = false;
  sub: any;
  product!: Observable<Product[]>;
  size: number = 0;
  user!: User;
  stock: number = 0;
  selectedProduct!: Product;
  similarProducts: Product[] = [];

  productImage!: string;
  colorSelected!: string;
  isColorSelected = false;
  isSizeSelected = false;
  grandTotal: number = 0;

  apiKey = 'AIzaSyCKj-l5U2bLY3wEx-9DN1owQhs3a9iJ-Uw';
  preBtn!: Element;
  fee: number = 0;
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private productService: ProductService,
    public userService: UserService,
    private snackBar: SnackbarService
    ) {
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
      const id: string = params.id; // (+) converts string 'id' to a number
      this.getProductDetail(id);
      this.product= this.productService.product;
      if(this.productService.productList){
        this.getSimilarProducts(id);
      }
    });
  }

  getSimilarProducts(id: string){
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
  }


  getProductDetail(id: string) {
    this.productService.getProductById(id);
  }


  onColorPick(event: MatRadioChange | MatButtonToggleChange){
    this.isColorSelected = true;
    //this.productImage = this.product.imageList[event.value];
    //this.colorSelected =  this.product.variants[event.value].color;
  }

  openDialog(product: Product) {
    this.dialog.open(CheckAvailabilityComponent, {
      data: {
        call: 'product',
        size: this.size,
        modelNo: product.modelNo!,
        sizes: product.variants[0].sizes
      },
      maxWidth: '100vw',
      maxHeight: '100vh'
    });
  }

  addToCart(product: Product){
    if(this.isSizeSelected){
      const cartProduct: CartProduct = {
        productImage: product.imageList[0],
        modelNo : product.modelNo,
        noOfItems : 1,
        size : +this.size,
        vendor: product.companyName!,
        productName: product.name,
        price: product.price
      }
      this.productService.addToCart(cartProduct);
    }else{
      if(this.stock === 0){
        this.snackBar.info('Please change store as product is not available in selected store');
      }else{
        this.snackBar.info('Please select size of product');
      }

    }

  }
  variantSelect(index: number, modelNo: string){
    this.productService.getProductById(modelNo);
    this.product = this.productService.product;
    const buttonList = document.getElementsByClassName('variant-image');
    buttonList[index].classList.add("active");
    if(this.preBtn){
      this.preBtn.classList.remove("active");
    }
    this.preBtn = buttonList[index];
  }
  sizeSelected(size: any){
    this.size = size;
    this.isSizeSelected = true;
    this.checkProductInStore();
  }
  checkAvailability(product: Product){
    window.scrollTo(0,0);
    this.openDialog(product);
  }

  checkProductInStore(){
    this.product.subscribe(product=>{
      this.selectedProduct = product[0];
    });
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
