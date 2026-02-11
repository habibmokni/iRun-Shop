import { Component, ElementRef, NgZone, OnInit, ViewChild, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { CartProduct } from 'src/app/shared/models/cart-product.model';
import { Store } from 'src/app/shared/models/store.model';
import { MapsService } from 'src/app/shared/services/maps.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MapsComponent } from 'src/app/maps/maps.component';
import { MatCardTitle, MatCardSubtitle, MatCardContent } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatTabGroup, MatTab } from "@angular/material/tabs";
import { MatFormField } from "@angular/material/input";

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MapsComponent,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatDivider,
    MatTabGroup,
    MatTab,
    MatFormField
]
})
export class AvailabilityComponent implements OnInit {
  private ngZone = inject(NgZone);
  private mapService = inject(MapsService);
  private storeService = inject(StoreService);
  private snackbarService = inject(SnackbarService);
  private dialog = inject(MatDialog);
  private productService = inject(ProductService);
  private userService = inject(UserService);
  data = inject(MAT_DIALOG_DATA);


  mapHeight = 410;
  mapWidth = 700;
  private screenSize = screen.width;
  closestStore!: Store;
  nearByStores: {stores: Store, distances: number, stock: number}[] =[];
  productAvailabilty: string[] = [];
  stores: Store[] = [];
  size=0;
  isSizeSelected = false;


  constructor() {

    this.storeService.store.subscribe(stores=>{
      console.log(stores);
      this.stores = stores;
      console.log(this.stores);
    });
  }

  ngOnInit(): void {
    if(this.screenSize <= 599){
      this.mapHeight= 350;
      this.mapWidth= 250;
    };
    const colorAndModelSelected = this.productService.selectedModelAndSize;
    console.log(colorAndModelSelected);
    if(this.data.size){
      this.size = this.data.size;
      this.isSizeSelected = true;
    }

    setTimeout(()=>{
      const input= document.getElementById("search") as HTMLInputElement;

      const autocomplete = new google.maps.places.Autocomplete(input);

      autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        this.nearByStores= [];

        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null || !place.geometry.location) {
          return;
        }
        const container = document.querySelector('.pac-container') as HTMLElement;
        if(container){
          console.log('found container');
          container.style.top = '500px';
        }
        //set latitude, longitude and zoom
        let latitude = place.geometry.location.lat();
        let longitude = place.geometry.location.lng();
        let zoom = 12;

        console.log(latitude + "longitude" + longitude);

        if(this.data.call === "product"){
          this.mapService.find_closest_marker(latitude, longitude);
          setTimeout(() => {
            this.checkProductAvailabilty(this.data.modelNo,this.size);
          }, 100);

        }
        if(this.data.call === "checkout"){
          this.mapService.find_closest_marker(latitude, longitude);
          setTimeout(() => {
            this.checkAllProductsAvailabilty(this.productService.getLocalCartProducts());
          },100);

        }
        console.log(this.nearByStores);
      });
    });

    },500);


    const options= {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
      types: ["establishment"]
    };


  }

  findClosestStore(){
    this.storeService.store.forEach(stores=>{
      for(let store of stores){
        if(store.location.lat === this.mapService.closestMarker.lat && store.location.lng === this.mapService.closestMarker.lng){
          this.closestStore = store;
        }
      }
    })

  }

  checkProductAvailabilty(modelNo: string, productSize: number){
    let i=0;

      for(let store of this.stores){
        console.log(store);
          //yahan products ki for loop use karni h
          for(let product of store.products){
            if(product.modelNo === modelNo){
              console.log("model true");
              for(let variant of store.products[0].variants){
                for(let index=0; index<variant.sizes.length; index++){

                  if(+variant.sizes[index] === +productSize){
                    console.log(variant.sizes[index]);
                    this.nearByStores.push({
                      stores: store,
                      stock: +variant.inStock[index],
                      distances: this.mapService.distanceInKm[i]
                    });
                    console.log(this.nearByStores);
                 }
                    this.nearByStores.sort((a,b)=> a.distances-b.distances)
                }
              }
            }

          }
          i++;
        }
        console.log(this.nearByStores);
    }


    checkAllProductsAvailabilty(cartProducts: CartProduct[]){
      let i=0;
      let isAvailable = 0;
        for(let store of this.stores){
          console.log('store changed');

            //yahan products ki for loop use karni h
            for(let product of store.products){
              for(let a=0; a<cartProducts.length; a++){
                if(product.modelNo === cartProducts[a].modelNo){

                  for(let variant of store.products[0].variants){
                    for(let index=0; index<variant.sizes.length; index++){

                      if(variant.sizes[index] === cartProducts[a].size && +variant.inStock[index] >= cartProducts[a].noOfItems!){
                        isAvailable = 10;
                        console.log('product found with all the requirements');

                     }
                     if(variant.sizes[index] === cartProducts[a].size && +variant.inStock[index] <= cartProducts[a].noOfItems!){
                       isAvailable = 0;
                       console.log('no of items in cart exceed no of items available');
                     }
                    }
                  }
                }
              }
            }
            this.nearByStores.push({
              stores: store,
              stock: isAvailable,
              distances: this.mapService.distanceInKm[i]
            });
            this.nearByStores.sort((a,b)=> a.distances-b.distances);
            i++;
          }

      }



    onStoreSelect(store: Store){
      if(!this.userService.user){
        this.userService.addUserTodb({
          name: "Anonymous",
          storeSelected: store
        });
      }else{
        this.userService.updateSelectedStore({
          name: "Anonymous",
          storeSelected: store
        });
      }

      this.snackbarService.success('Store selected as prefered');
      this.dialog.closeAll();
    }
    changeSize(size: any){
      if(this.nearByStores){
       this.nearByStores = [];
      }
      this.size = size;
      this.isSizeSelected = true;
    }
    currentLocation(){
      this.mapService.getCurrentLocation();
      setTimeout(()=>{
        this.nearByStores = [];
        this.checkProductAvailabilty(this.data.modelNo,this.size);
      },1000)

    }

}
