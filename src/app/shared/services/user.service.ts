import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { User } from "../models/user.model";

@Injectable()
export class UserService{
  user!: User;
  userSub =new Subject<any>();
  constructor(){
    this.getUser();
  }

  addUserTodb(user: User){
    const a: User[] = JSON.parse(localStorage.getItem("avct_user")!) || [];
    a.push(user);
    setTimeout(() => {
      localStorage.setItem("avct_user", JSON.stringify(a));
      this.getUser();
      this.userSub.next(true);
    }, 500);

  }

  getUser(){
    const user: User[] =
      JSON.parse(window.localStorage.getItem("avct_user")!) || [];
      console.log("Üser from storage"+ user[0]);
      this.user = user[0];
  }
  updateSelectedStore(user: User){
    console.log(user.storeSelected);
    const a: User[]= JSON.parse(window.localStorage.getItem("avct_user")!) || [];
    a[0] = user;
    localStorage.setItem("avct_user", JSON.stringify(a));
    this.user = a[0];
    this.userSub.next(true);
  }

}
