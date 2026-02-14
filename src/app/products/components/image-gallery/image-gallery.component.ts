import { Component, ChangeDetectionStrategy, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ImageGalleryData } from '../../types/image-gallery.types';

@Component({
	selector: 'app-image-gallery',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './image-gallery.component.html',
	styleUrls: ['./image-gallery.component.css'],
	imports: [MatButtonModule, MatIconModule],
})
export class ImageGalleryComponent {
	private readonly dialogRef = inject(MatDialogRef<ImageGalleryComponent>);
	private readonly data = inject<ImageGalleryData>(MAT_DIALOG_DATA);
	private readonly carouselRef = viewChild.required<ElementRef<HTMLElement>>('galleryCarousel');

	protected readonly images = this.data.images;
	protected readonly activeIndex = signal(this.data.startIndex);

	constructor() {
		afterNextRender(() => {
			const carousel = this.carouselRef().nativeElement;
			if (this.data.startIndex > 0) {
				carousel.scrollTo({ left: this.data.startIndex * carousel.clientWidth, behavior: 'instant' });
			}
		});
	}

	protected onScroll(): void {
		const carousel = this.carouselRef().nativeElement;
		const index = Math.round(carousel.scrollLeft / carousel.clientWidth);
		if (index !== this.activeIndex()) {
			this.activeIndex.set(index);
		}
	}

	protected close(): void {
		this.dialogRef.close();
	}
}
