import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

interface IntroStep {
	readonly number: number;
	readonly image: string;
	readonly title: string;
	readonly description: string;
}

@Component({
	selector: 'app-intro-page',
	templateUrl: './intro-page.component.html',
	styleUrls: ['./intro-page.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgOptimizedImage, MatButtonModule],
})
export class IntroPageComponent {
	private readonly router = inject(Router);

	readonly showIntro = output<boolean>();

	protected readonly steps: readonly IntroStep[] = [
		{
			number: 1,
			image: 'assets/images/intro/1.jpg',
			title: 'Select product',
			description:
				'Find the product you want to purchase and add it to your shopping cart. Click on the checkout button once the item is in your cart.',
		},
		{
			number: 2,
			image: 'assets/images/intro/2.jpg',
			title: 'Select your store',
			description:
				'Whilst in the checkout you can choose the Collect in Store and choose the store you wish to collect your product in.',
		},
		{
			number: 3,
			image: 'assets/images/intro/3.jpg',
			title: 'Complete your order',
			description:
				'Complete the payment form. You will receive a confirmation email after purchase when the store has processed the order to confirm that your product is ready for collection.',
		},
		{
			number: 4,
			image: 'assets/images/intro/4.jpg',
			title: 'Collect Product',
			description: 'Go to your local store and pick up your purchased product.',
		},
		{
			number: 5,
			image: 'assets/images/intro/5.jpg',
			title: 'Enjoy',
			description: 'Enjoy your product.',
		},
	];

	protected onContinue(): void {
		this.showIntro.emit(false);
		this.router.navigate(['/home']);
	}
}
