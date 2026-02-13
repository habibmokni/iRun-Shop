import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { PAYMENT_PARTNERS } from '../../constants/payment-partners';


@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatRadioModule, MatCardModule],
})
export class PaymentMethodsComponent {
  readonly paymentMethod = input.required<FormGroup>();

  protected readonly paymentPartners = PAYMENT_PARTNERS;

  protected isInvalid(): boolean {
    const ctrl = this.paymentMethod().get('paymentOption');
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }
}
