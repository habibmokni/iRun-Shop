import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-paymentMethods',
  templateUrl: './paymentMethods.component.html',
  styleUrls: ['./paymentMethods.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatRadioModule, MatCardModule]
})
export class PaymentMethodsComponent implements OnInit {
  //gets formGroup from parent
  @Input() paymentMethod!: FormGroup;
  paymentPartner:
    {name:string,
    logo: string}[] = [
      {name:'MasterCard', logo: '../../assets/images/logos/mastercard-logo.png'},
      {name:'Visa', logo: '../../assets/images/logos/Visa-logo.png'},
      {name:'Paypal', logo: '../../assets/images/logos/paypal-logo.jpg'}];
  constructor() { }

  ngOnInit(): void {
  }

}
