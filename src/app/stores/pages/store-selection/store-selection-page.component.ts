import {
	Component,
	ChangeDetectionStrategy,
	CUSTOM_ELEMENTS_SCHEMA,
	inject,
	signal,
	computed,
	afterNextRender,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Store } from '../../types/store.types';
import { StoreService } from '../../services/store.service';
import { StoreCardComponent } from '../../components/store-card/store-card.component';
import { MapsService } from '../../services/maps.service';
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
	imports: [MatButtonModule, MatIconModule, StoreCardComponent],
})
export class StoreSelectionPageComponent {
	private readonly storeService = inject(StoreService);
	private readonly mapsService = inject(MapsService);
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

	/** User's current coordinates (null until geolocation resolves). */
	private readonly userLocation = signal<google.maps.LatLngLiteral | null>(null);

	/** Distance in km from the user to each store, keyed by store id. */
	protected readonly distanceMap = computed<Record<string, number>>(() => {
		const loc = this.userLocation();
		const allStores = this.stores();
		if (!loc || !allStores.length) return {};

		const map: Record<string, number> = {};
		for (const store of allStores) {
			if (store.location) {
				map[store.id] = this.mapsService.calculateDistance(
					loc.lat, loc.lng, store.location.lat, store.location.lng,
				);
			}
		}
		return map;
	});

	protected readonly selectedStoreId = computed(
		() => this.userService.user()?.storeSelected?.id ?? null,
	);

	/** The full store object for the user's currently selected store. */
	protected readonly currentStore = computed(() => {
		const id = this.selectedStoreId();
		if (!id) return null;
		return this.stores().find((s) => s.id === id) ?? null;
	});

	/** Whether the "other stores" section is expanded. */
	protected readonly otherStoresExpanded = signal(false);

	protected readonly filteredStores = computed(() => {
		const query = this.searchQuery().toLowerCase().trim();
		const allStores = this.stores();
		const selectedId = this.selectedStoreId();

		// Exclude selected store from the grid (it's shown separately)
		let list = selectedId ? allStores.filter((s) => s.id !== selectedId) : allStores;

		if (query) {
			list = list.filter(
				(store) =>
					store.name.toLowerCase().includes(query) ||
					store.address.toLowerCase().includes(query),
			);
		}
		return list;
	});

	constructor() {
		afterNextRender(() => {
			this.mapsService.requestGeolocation().then((coords) => {
				if (coords) this.userLocation.set(coords);
			});
		});
	}

	protected onSearch(event: Event): void {
		const value = (event.target as HTMLInputElement).value;
		this.searchQuery.set(value);
	}

	protected async selectStore(store: Store): Promise<void> {
		await this.userService.updateSelectedStore(store);
		await this.userService.setFavoriteStore(store);
		this.snackbar.success('Store updated');
	}

}
