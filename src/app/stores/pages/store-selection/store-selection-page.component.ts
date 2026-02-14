import {
	Component,
	ChangeDetectionStrategy,
	CUSTOM_ELEMENTS_SCHEMA,
	inject,
	signal,
	computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Store } from '../../types/store.types';
import { StoreService } from '../../services/store.service';
import { UserService } from '../../../user/services/user.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';

type StoreView = 'map' | 'list';

@Component({
	selector: 'app-store-selection-page',
	templateUrl: './store-selection-page.component.html',
	styleUrls: ['./store-selection-page.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [MatButtonModule, MatIconModule],
})
export class StoreSelectionPageComponent {
	private readonly storeService = inject(StoreService);
	private readonly userService = inject(UserService);
	private readonly snackbar = inject(SnackbarService);

	protected readonly stores = toSignal(this.storeService.store, {
		initialValue: [] as Store[],
	});

	protected readonly searchQuery = signal('');
	protected readonly activeView = signal<StoreView>('list');

	/**
	 * Google Maps API key in @habibmokni/cnc is expired.
	 * Re-enable once a valid key is configured in the cnc package.
	 */
	protected readonly mapsAvailable = signal(false);

	protected readonly selectedStoreId = computed(
		() => this.userService.user()?.storeSelected?.id ?? null,
	);

	protected readonly filteredStores = computed(() => {
		const query = this.searchQuery().toLowerCase().trim();
		const allStores = this.stores();
		if (!query) return allStores;
		return allStores.filter(
			(store) =>
				store.name.toLowerCase().includes(query) ||
				store.address.toLowerCase().includes(query),
		);
	});

	protected onSearch(event: Event): void {
		const value = (event.target as HTMLInputElement).value;
		this.searchQuery.set(value);
	}

	protected selectStore(store: Store): void {
		this.userService.updateSelectedStore(store);
		this.userService.setFavoriteStore(store);
		this.snackbar.success(`${store.name} selected as your store`);
	}

}
