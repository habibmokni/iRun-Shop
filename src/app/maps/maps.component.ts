import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { Observable} from 'rxjs';
import { Store } from '../shared/models/store.model';
import { MapsService } from '../shared/services/maps.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { StoreService } from '../shared/services/store.service';
import { UserService } from '../shared/services/user.service';
import { Location} from './../shared/models/location.model';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow ;
  @Input() mapHeight: number= 450;
  @Input() mapWidth: number= screen.width;



  options: google.maps.MapOptions = {
    center: {lat: 51.44157584725519, lng: 7.565725496333208},
    zoom: 8
  };

  currentStore!: Store;
  //storeLocations: {lat: number, lng: number}[];
  storeList = new Observable<Store[]>();

  currentLocation: google.maps.LatLngLiteral = { lat: 51.44157584725519, lng: 7.565725496333208};
  logo="../../assets/images/logos/location.png";
  icon = {
    url: "../../assets/images/logos/current-location.png", // url
};

  directionsResults$!: Observable<google.maps.DirectionsResult|undefined>;

  storeLocations: google.maps.LatLngLiteral[];

  constructor(
    private storeService: StoreService,
    private mapsService: MapsService,
    private snackBarService: SnackbarService,
    private dialog: MatDialog,
    public userService: UserService,

    ){
        if(userService.user){
          this.currentStore = this.userService.user.storeSelected;
        }

      this.storeList = this.storeService.store;
      this.storeLocations = this.storeService.storeLocations;
      //console.log(this.storeLocations);

    }
  ngOnInit(): void {
  }
  currentUserLocation: google.maps.LatLngLiteral = { lat: 31.4914, lng: 74.2385};

  onGetCurrentLocation(){
    this.mapsService.getCurrentLocation()
    setTimeout(()=>{
      this.options = {
        center: this.mapsService.currentLocation
      };
      this.currentUserLocation = this.mapsService.currentLocation;
    },500)

  }
  onGetDirections(location: Location){
    this.mapsService.getDirections(location);
    this.directionsResults$ = this.mapsService.storeDirectionsResults$;
    this.options.zoom=2;
  }
  openInfoWindow(marker: MapMarker, store: Store, event: google.maps.MapMouseEvent) {
    this.currentStore = store;
    console.log(this.currentStore.name);
    this.infoWindow.open(marker);
    this.storeService.currentStoreLocation = event.latLng.toJSON();
    console.log(this.storeService.currentStoreLocation);
    this.storeService.currentStore = this.currentStore;
  }
  onSelectStore(store: Store){
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
    this.snackBarService.success('Store Selected Successfully');
    this.infoWindow.close();
    this.dialog.closeAll();
  }
}
