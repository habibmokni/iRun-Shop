import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup = new FormGroup({
    email : new FormControl('', [Validators.required]),
    password : new FormControl('', [Validators.required])
  });

  hide = true;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router, private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    if(localStorage.getItem("isLoggedIn")){
      this.router.navigate(['/home']);
      this.snackbarService.success('User already logged in');
    }
    this.authService.user.subscribe((data: any)=>{
      this.router.navigate(['/home']);
      this.snackbarService.success('Login Successfull');
    },(error: any)=>{
      this.isLoading = false;
      this.snackbarService.error('Wrong credentials! Please try again')
    });
  }

  login(){
    this.isLoading = true;
    this.authService.login(this.loginForm.value);
  }

}
