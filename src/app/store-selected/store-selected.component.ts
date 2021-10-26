import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '../shared/models/store.model';
import { User } from '../shared/models/user.model';
import { MapsService } from '../shared/services/maps.service';
import { StoreService } from '../shared/services/store.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-store-selected',
  templateUrl: './store-selected.component.html',
  styleUrls: ['./store-selected.component.css']
})
export class StoreSelectedComponent implements OnInit {

  user!: User;
  nearByStores: {stores: Store, distances: number}[] =[];
  stores!: Store[];
  storeLocations: any[]= [];


  constructor(
    private ngZone: NgZone,
    public dialog: MatDialog,
    public userService: UserService,
    private storeService: StoreService,
    private mapService: MapsService
    ) {
      if(userService.user){
        this.user = this.userService.user;
      }
        userService.userSub.subscribe(()=>{
          this.user = userService.user;
          console.log(this.user);
        })
        this.storeService.store.subscribe(stores=>{

          this.stores = stores;

        });
        this.storeLocations = storeService.storeLocations;
        console.log(this.storeLocations);
    }


  ngOnInit(): void {
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

        //set latitude, longitude and zoom
        let latitude = place.geometry.location.lat();
        let longitude = place.geometry.location.lng();
        let zoom = 12;

        console.log(latitude + "longitude" + longitude);
        this.mapService.find_closest_marker(latitude, longitude);

        this.storesNearBy()
      });
    });

    },3000);

  }

  storesNearBy(){
    let i=0;
      for(let store of this.stores){
        this.nearByStores.push({
          stores: store,
          distances: this.mapService.distanceInKm[i]
        });
        this.nearByStores.sort((a,b)=> a.distances-b.distances)
        i++;
      }
  }
  openDialog(){
    this.storesNearBy();
  }
  onStoreSelect(store: Store){
    if(!this.userService.user){
      this.userService.addUserTodb({
        name: "Anonymous",
        storeSelected: store
      });
      this.nearByStores = [];
    }else{
      this.userService.updateSelectedStore({
        name: "Anonymous",
        storeSelected: store
      });
      this.nearByStores=[];
    }
  }
}
