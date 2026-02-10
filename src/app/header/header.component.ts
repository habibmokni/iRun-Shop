import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../auth/auth.service';
import { ProductService } from '../shared/services/product.service';
import { SnackbarService } from '../shared/services/snackbar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule
  ]
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
    this.checkUserLogin();
    this.authService.isLoggedIn.subscribe((data:any)=>{
      this.checkUserLogin();
      this.isLoggedIn = data;
    });
  }

  checkUserLogin(){
    if(localStorage.getItem("isLoggedIn")){
      this.isLoggedIn = true;
      this.user = JSON.parse(localStorage.getItem("user")!);
      console.log(this.user);
    }
  }

  onLogout(){
    localStorage.removeItem("isLoggedIn");
    this.authService.checkLogIn();
    this.router.navigate(['home']);
    this.snackbar.success("Logout successfully!");
  }

}
