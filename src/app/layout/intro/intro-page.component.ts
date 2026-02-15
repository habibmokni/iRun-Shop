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
			title: 'Browse & add to cart',
			description:
				'Find the perfect running shoes, add them to your cart, and head to checkout when you\'re ready.',
		},
		{
			number: 2,
			image: 'assets/images/intro/2.jpg',
			title: 'Choose your store',
			description:
				'Select Click & Collect at checkout and pick the store most convenient for you.',
		},
		{
			number: 3,
			image: 'assets/images/intro/3.jpg',
			title: 'Complete payment',
			description:
				'Pay securely online. We\'ll send you a confirmation email once your order is ready for pickup.',
		},
		{
			number: 4,
			image: 'assets/images/intro/4.jpg',
			title: 'Pick up in store',
			description:
				'Head to your chosen store with your ID and order number. Your items will be waiting for you.',
		},
		{
			number: 5,
			image: 'assets/images/intro/5.jpg',
			title: 'Hit the road',
			description: 'Lace up and enjoy your new gear. See you on the track!',
		},
	];

	protected onContinue(): void {
		this.showIntro.emit(false);
		this.router.navigate(['/home']);
	}
}
