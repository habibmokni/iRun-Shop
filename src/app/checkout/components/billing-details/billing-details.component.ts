import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
	selector: 'app-billing-details',
	templateUrl: './billing-details.component.html',
	styleUrls: ['./billing-details.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule],
})
export class BillingDetailsComponent {
	readonly billing = input.required<FormGroup>();
	readonly type = input('Delivery Details');

	protected isFieldInvalid(field: string): boolean {
		const control = this.billing().get(field);
		return !!control && control.invalid && control.touched;
	}
}
