import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ProductService } from '../shared/services/product.service';
import { SnackbarService } from '../shared/services/snackbar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean = false;
  user: any;
  constructor(
    public productService: ProductService,
    private snackbar: SnackbarService,
    private authService: AuthService,
    private router: Router
    ) {
   }

  ngOnInit(): void {
    if(localStorage.getItem("isLoggedIn")){
      this.isLoggedIn = true;
      this.user = JSON.parse(localStorage.getItem("user")!);
      console.log(this.user);
    }
    this.authService.isLoggedIn.subscribe((data:any)=>{
      this.isLoggedIn = data;
    });
  }

  onLogout(){
    localStorage.removeItem("isLoggedIn");
    this.authService.checkLogIn();
    this.router.navigate(['home']);
    this.snackbar.success("Logout successfully!");
  }

}
