import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: false
})
export class UserProfileComponent implements OnInit {

  isLoggedIn: boolean = false;
  user: any;
  constructor(){}

  ngOnInit(){
    if(localStorage.getItem("isLoggedIn")){
      this.user=JSON.parse(localStorage.getItem("user")!);
    }
    // this.authService.checkLogIn();
    // this.authService.isLoggedIn.subscribe((data: boolean)=>{
    //   this.isLoggedIn = data;
    //   if(this.isLoggedIn){
    //     this.user = JSON.parse(localStorage.getItem("user")!);
    //     console.log(this.user.firstName);
    //   }else{
    //     this.user = null
    //   }
    // });
  }

}
