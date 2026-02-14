import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';

import { Product } from '../../../products/types/product.types';

@Component({
	selector: 'app-size-selector',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="size-selector">
			<div class="size-grid">
				@for (size of sizes(); track size; let i = $index) {
					<button
						class="size-btn"
						[class.selected]="selectedIndex() === i"
						[class.out-of-stock]="stock()[i] === 0"
						[disabled]="stock()[i] === 0"
						(click)="onSelect(i)"
					>
						<span class="size-value">{{ size }}</span>
						@if (stock()[i] === 0) {
							<span class="stock-label sold-out">Sold out</span>
						} @else if (stock()[i] < 5) {
							<span class="stock-label low-stock">{{ stock()[i] }} left</span>
						}
					</button>
				}
			</div>
		</div>
	`,
	styles: `
		.size-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
			gap: 8px;
		}

		.size-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 10px 4px;
			border: 1.5px solid #e0e0e0;
			border-radius: 8px;
			background: #fff;
			cursor: pointer;
			transition: border-color 0.15s, background 0.15s;
			min-height: 48px;
		}

		.size-btn:hover:not(:disabled) {
			border-color: #999;
		}

		.size-btn.selected {
			border-color: #8b283d;
			background: #fdf2f4;
		}

		.size-btn.out-of-stock {
			opacity: 0.45;
			cursor: not-allowed;
			background: #f5f5f5;
		}

		.size-value {
			font-size: 14px;
			font-weight: 600;
		}

		.stock-label {
			font-size: 10px;
			margin-top: 2px;
		}

		.low-stock {
			color: #e67e22;
		}

		.sold-out {
			color: rgba(0, 0, 0, 0.35);
		}

		@media (max-width: 768px) {
			.size-grid {
				grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
				gap: 6px;
			}

			.size-btn {
				padding: 6px 2px;
				min-height: 38px;
				border-radius: 6px;
			}

			.size-value {
				font-size: 13px;
			}

			.stock-label {
				font-size: 9px;
			}
		}
	`,
})
export class SizeSelectorComponent {
	readonly product = input.required<Product>();

	readonly sizeSelected = output<number>();

	protected readonly selectedIndex = signal<number | null>(null);

	protected readonly sizes = computed(() => this.product().variants?.[0]?.sizes ?? []);

	protected readonly stock = computed(() => this.product().variants?.[0]?.inStock ?? []);

	protected onSelect(index: number): void {
		this.selectedIndex.set(index);
		this.sizeSelected.emit(this.sizes()[index]);
	}
}
