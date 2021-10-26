import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { StoreService } from 'src/app/shared/services/store.service';
import { AvailabilityComponent } from 'src/app/shop/product-page/availability/availability.component';

@Component({
  selector: 'app-shipping-methods',
  templateUrl: './shipping-methods.component.html',
  styleUrls: ['./shipping-methods.component.css']
})
export class ShippingMethodsComponent implements OnInit {

  type= new FormControl;
  @Input() shippingMethod!: FormGroup;

  dateControl = new FormControl(new Date());
  minDate= new Date();


  selectedStore!: {address: string, location: {lat: number, lng: number}};

  mapHeight = 410;
  mapWidth = 350;
  private screenSize = screen.width;

  myFilter = (d: Date | null): boolean =>{
    const day = (d || new Date()).getDay();
    return day !==0 && day !==6;
  }

  constructor(private storeService: StoreService, private dialog: MatDialog) {
      if(this.storeService.storeSelection){
        this.selectedStore = this.storeService.storeSelection;
      }else{
        this.storeService.selectedStore.subscribe(store=>{
          this.selectedStore = store;
        })
      }
    }

  ngOnInit(): void {
    if(this.screenSize <= 599){
      this.mapHeight= 410;
      this.mapWidth= 350;
    }
  }


  onOpenDialog(){
    this.dialog.open(AvailabilityComponent);
  }
}
