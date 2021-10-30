import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CartProduct } from 'src/app/shared/models/cartProduct.model';
import { Product } from 'src/app/shared/models/product.model';
import { Store } from 'src/app/shared/models/store.model';
import { MapsService } from 'src/app/shared/services/maps.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit {

  mapHeight = 410;
  mapWidth = 700;
  private screenSize = screen.width;
  closestStore!: Store;
  nearByStores: {stores: Store, distances: number, stock: number}[] =[];
  productAvailabilty: string[] = [];
  stores: Store[] = [];
  size=0;
  isSizeSelected = false;

  constructor(
    private ngZone: NgZone,
    private mapService: MapsService,
    private storeService: StoreService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private productService: ProductService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {

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
        if (place.geometry === undefined || place.geometry === null) {
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
