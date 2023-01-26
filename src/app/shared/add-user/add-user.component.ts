import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {

  registerForm: FormGroup = new FormGroup({
    firstName : new FormControl('', [Validators.required]),
    lastName : new FormControl('', [Validators.required]),
    email : new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl('', [Validators.required]),
    confirmPassword : new FormControl('', [Validators.required]),
    address : new FormControl('', [Validators.required]),
    zipCode : new FormControl('', [Validators.required]),
  });

  hide = true;
  isLoading: boolean = false;

  constructor(private router: Router, private snackbarService: SnackbarService) { }

  ngOnInit(): void {

  }

  onRegister(){
    this.isLoading = true;
    if(this.registerForm.valid){
      localStorage.setItem('user', JSON.stringify(this.registerForm.value));
      this.snackbarService.success("User added successfully!");
      this.registerForm.reset();
      this.isLoading = false;
      setTimeout(()=>{
        this.router.navigate(['home']);
      },2000)
    }else{
      this.isLoading = false;
      this.snackbarService.error("Opps! Something went wrong");
    }
  }

  onCancel(){
    this.router.navigate(['home']);
  }
}
