import {
	Component,
	ChangeDetectionStrategy,
	inject,
	signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

import { Store } from '../../stores/types/store.types';
import { StoreService } from '../../stores/services/store.service';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
	selector: 'app-admin-stores-page',
	templateUrl: './admin-stores-page.component.html',
	styleUrls: ['./admin-stores-page.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ReactiveFormsModule,
		MatTableModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatCardModule,
		MatCheckboxModule,
		RouterLink,
		DecimalPipe,
	],
})
export class AdminStoresPageComponent {
	private readonly storeService = inject(StoreService);
	private readonly snackbar = inject(SnackbarService);

	protected readonly stores = toSignal(this.storeService.store, {
		initialValue: [] as Store[],
	});

	protected readonly displayedColumns = [
		'name',
		'address',
		'location',
		'openingTime',
		'isDefaultStore',
		'products',
		'actions',
	];

	protected readonly editing = signal<Store | null>(null);
	protected readonly showForm = signal(false);

	protected readonly form = new FormGroup({
		name: new FormControl('', [Validators.required]),
		address: new FormControl('', [Validators.required]),
		lat: new FormControl<number>(0, [Validators.required]),
		lng: new FormControl<number>(0, [Validators.required]),
		openTime: new FormControl('', [Validators.required]),
		closeTime: new FormControl('', [Validators.required]),
		isDefaultStore: new FormControl(false),
		description: new FormControl(''),
		reviews: new FormControl(''),
	});

	protected onAdd(): void {
		this.editing.set(null);
		this.form.reset({ lat: 0, lng: 0, isDefaultStore: false });
		this.showForm.set(true);
	}

	protected onEdit(store: Store): void {
		this.editing.set(store);
		this.form.patchValue({
			name: store.name,
			address: store.address,
			lat: store.location.lat,
			lng: store.location.lng,
			openTime: store.openingTime.open,
			closeTime: store.openingTime.close,
			isDefaultStore: store.isDefaultStore,
			description: store.description ?? '',
			reviews: store.reviews ?? '',
		});
		this.showForm.set(true);
	}

	protected onCancel(): void {
		this.showForm.set(false);
		this.editing.set(null);
		this.form.reset();
	}

	protected onSubmit(): void {
		if (this.form.invalid) return;
		const formValue = this.form.getRawValue();

		const store: Store = {
			id: this.editing()?.id ?? '',
			name: formValue.name ?? '',
			address: formValue.address ?? '',
			location: {
				lat: formValue.lat ?? 0,
				lng: formValue.lng ?? 0,
			},
			openingTime: {
				open: formValue.openTime ?? '',
				close: formValue.closeTime ?? '',
			},
			isDefaultStore: formValue.isDefaultStore ?? false,
			description: formValue.description ?? '',
			reviews: formValue.reviews ?? '',
			products: this.editing()?.products ?? [],
		};

		const currentEditing = this.editing();
		if (currentEditing?.id) {
			this.storeService.updateStore(currentEditing.id, store);
			this.snackbar.success('Store updated');
		} else {
			this.storeService.addStore(store);
			this.snackbar.success('Store added');
		}

		this.onCancel();
	}

	protected onDelete(store: Store): void {
		if (!store.id) return;
		if (!confirm(`Delete store "${store.name}"? This cannot be undone.`)) return;

		this.storeService.deleteStore(store.id);
		this.snackbar.success('Store deleted');
	}
}
