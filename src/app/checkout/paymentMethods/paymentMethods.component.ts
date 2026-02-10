import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-paymentMethods',
  templateUrl: './paymentMethods.component.html',
  styleUrls: ['./paymentMethods.component.css'],
  standalone: false
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
