import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { Product } from '../../../products/types/product.types';

@Component({
	selector: 'app-size-selector',
	standalone: true,
	imports: [MatFormFieldModule, MatSelectModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<mat-form-field appearance="outline" subscriptSizing="dynamic" class="size-field">
			<mat-label>Select size</mat-label>
			<mat-select panelClass="size-select-panel" (selectionChange)="onSelect($event.value)">
				<mat-select-trigger>
					@if (selectedIndex() !== null) {
						{{ sizes()[selectedIndex()!] }}
					}
				</mat-select-trigger>
				@for (size of sizes(); track size; let i = $index) {
					<mat-option [value]="i" [disabled]="stock()[i] === 0">
						<span class="option-row">
							<span>{{ size }}</span>
							@if (stock()[i] === 0) {
								<span class="stock-hint sold-out">Sold out</span>
							} @else if (stock()[i] < 5) {
								<span class="stock-hint low-stock">{{ stock()[i] }} left</span>
							}
						</span>
					</mat-option>
				}
			</mat-select>
		</mat-form-field>
	`,
	styles: `
		.size-field {
			width: 100%;
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
