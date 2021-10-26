import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatRadioChange } from '@angular/material/radio';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Product } from '../../shared/models/product.model';
import { AvailabilityComponent } from './availability/availability.component';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  @ViewChild(MatExpansionPanel) expansionPanel!: MatExpansionPanel;

  noOfItems = 1;
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
    private snackbarService: SnackbarService,
    public userService: UserService
    ) {
      if(userService.user){
        this.user = this.userService.user;
      }
        userService.userSub.subscribe(()=>{
          this.user = userService.user;
          for(let products of this.user.storeSelected.products){
            if(products.modelNo === this.selectedProduct.modelNo){
              for(let i=0; i<products.variants[0].sizes.length; i++){
                if(products.variants[0].sizes[i] === this.size){
                  this.stock = +products.variants[0].inStock[i];
                }
              }
            }
          }
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

  onSizeSelect(size: number, index:number, product: Product){
    this.size = size;
    this.selectedProduct=product;
    this.isSizeSelected = true;
    if(this.user){
      console.log('user entered');
      for(let products of this.user.storeSelected.products){
        if(products.modelNo === product.modelNo){
          console.log('model found');
          for(let i=0; i<products.variants[0].sizes.length; i++){
            if(products.variants[0].sizes[i] === size){
              console.log('size found');
              this.stock = +products.variants[0].inStock[i];
            }
          }
        }
      }
    }
    if(+product.variants[0].inStock[index]===0){
      this.openDialog(product);
    }
    this.expansionPanel.close();
    //const buttonList = document.getElementsByClassName('button');
    //buttonList[index].classList.add("active");
    //if(this.preBtn){
    //  this.preBtn.classList.remove("active");
    //}
    //this.preBtn = buttonList[index];
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
      if(this.isSizeSelected){
        this.productService.selectedModelAndSize = {
          modelNo: product.modelNo!,
          size: this.size
        };
        this.dialog.open(AvailabilityComponent, {
          data: {
            call: 'product'
          },
          maxHeight: '100vh',
          maxWidth: '100vw'
        });
      }else{
        this.snackbarService.error('Please select product size!');
      }
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
    product.productImage = this.productImage;
    product.color = this.colorSelected;
    product.noOfItems = this.noOfItems;
    product.size = this.size;
    this.productService.addToCart(product);
  }
  variantSelect(index: number, modelNo: string){
    this.productService.getProductById(modelNo);
    setTimeout(()=>{
      this.product = this.productService.product;
    },200);
    const buttonList = document.getElementsByClassName('variant-image');
    buttonList[index].classList.add("active");
    if(this.preBtn){
      this.preBtn.classList.remove("active");
    }
    this.preBtn = buttonList[index];
  }
}
