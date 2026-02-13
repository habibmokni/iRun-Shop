import { Component, input, ChangeDetectionStrategy, computed } from '@angular/core';

@Component({
	selector: 'app-image-slider',
	templateUrl: './image-slider.component.html',
	styleUrls: ['./image-slider.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageSliderComponent {
	readonly productImages = input<string[]>([]);
	readonly hasImages = computed(() => this.productImages().length > 0);
}
