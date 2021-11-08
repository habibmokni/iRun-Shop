import { Component } from '@angular/core';
import { ClickNCollectService } from '@habibmokni/cnc';
import { ProductService } from './shared/services/product.service';
import { StoreService} from './shared/services/store.service';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'click-and-collect';

  constructor(
    private storeService: StoreService,
    private userService: UserService,
    private cncService: ClickNCollectService,
    private productService: ProductService)
    {
      this.storeService.fetchStore();
      this.storeService.getStoreLocations();
      this.userService.getUser();
      //sending storeList to cnc package
      this.storeService.store.subscribe(storeList=>{
        this.cncService.setStoreList(storeList);
      });
      //sending store locations to cnc package service
      this.cncService.setStoreLocations(this.storeService.storeLocations);
      if(this.userService.user){
        this.cncService.setUser(this.userService.user);
      }
      //subscribing to user changes
      this.userService.userSub.subscribe(()=>{
        this.cncService.setUser(this.userService.user);
      });
      //connecting cnc package cart to local cart
      this.cncService.setCartProducts(this.productService.getLocalCartProducts());
      this.productService.cartProductsChanged.subscribe(cartProducts=>{
        this.cncService.setCartProducts(cartProducts);
      });
      //subscribing to cnc store changes
      this.cncService.storeSelected.subscribe(store=>{
        this.userService.updateSelectedStore({
          name: 'Anonymous',
          storeSelected: store
        });
      });
  }
}
