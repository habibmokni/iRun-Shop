import { Component, Input, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-billingDetails',
  templateUrl: './billingDetails.component.html',
  styleUrls: ['./billingDetails.component.css']
})
export class BillingDetailsComponent implements OnInit {
  //gets form from parent through property binding
  @Input() billing!: FormGroup;
  @Input() type = "Delivery Details";
  constructor() { }

  ngOnInit(): void {
  }

}
