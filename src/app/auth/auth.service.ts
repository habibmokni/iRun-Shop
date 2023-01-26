import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { EventEmitter } from 'stream';
import { SnackbarService } from '../shared/services/snackbar.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new Subject<any>();
  install = new Subject<any>();
  isLoggedIn = new Subject<boolean>();

  constructor(private httpClient: HttpClient, private router: Router, private snackbar: SnackbarService) {}

  login(credientials: any){
    let user = JSON.parse(localStorage.getItem('user')!);
    if(user.email == credientials.email && user.password == credientials.password){
      localStorage.setItem("isLoggedIn", "true");
      this.checkLogIn();
      this.user.next(true);
    }else{
      this.user.error("Wrong Credientials");
      this.snackbar.error("Wrong Credientials! Please try again");
    }
  }
  public isAuthenticated(): boolean {
    //const token = localStorage.getItem('token') || undefined;
    // Check whether the token is expired and return
    // true or false
    //return !this.jwtHelper.isTokenExpired(token);
    if(localStorage.getItem('email')){
      return true;
    }else{
      return false;
    }
  }

  checkLogIn(){
    if(localStorage.getItem("isLoggedIn")){
      this.isLoggedIn.next(true);
    }else{
      this.isLoggedIn.next(false);
    }
  }
}
