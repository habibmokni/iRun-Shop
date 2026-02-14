import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Store } from '../../types/store.types';

@Component({
	selector: 'app-store-card',
	templateUrl: './store-card.component.html',
	styleUrls: ['./store-card.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatButtonModule, MatIconModule],
})
export class StoreCardComponent {
	readonly store = input.required<Store>();
	readonly selected = input(false);
	readonly distance = input<number | null>(null);
	readonly stock = input<number | null>(null);

	readonly storeSelect = output<Store>();

	protected onSelect(): void {
		this.storeSelect.emit(this.store());
	}
}
