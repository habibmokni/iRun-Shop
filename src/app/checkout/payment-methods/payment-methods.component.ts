import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css']
})
export class PaymentMethodsComponent implements OnInit {
  @ViewChild(MatExpansionPanel) expansionPanel!: MatExpansionPanel;

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
