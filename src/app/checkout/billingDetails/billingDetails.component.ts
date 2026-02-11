import { Component, OnInit, input } from '@angular/core';

import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-billingDetails',
  templateUrl: './billingDetails.component.html',
  styleUrls: ['./billingDetails.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule]
})
export class BillingDetailsComponent implements OnInit {
  readonly billing = input.required<FormGroup>();
  readonly type = input("Delivery Details");
  constructor() { }

  ngOnInit(): void {
  }

}
