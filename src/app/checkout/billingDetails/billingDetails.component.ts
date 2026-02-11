import { Component, Input, OnInit} from '@angular/core';

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
  //gets form from parent through property binding
  @Input() billing!: FormGroup;
  @Input() type = "Delivery Details";
  constructor() { }

  ngOnInit(): void {
  }

}
