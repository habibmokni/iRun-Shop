import { Component, ChangeDetectionStrategy, inject, computed, signal, input, output } from '@angular/core';
import { filter } from 'rxjs';

import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';

import { Product } from '../../types/product.types';
import {
	FilterBottomSheetComponent,
	FilterSheetData,
	FilterSheetResult,
} from '../filter-bottom-sheet/filter-bottom-sheet.component';

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'discount';

const SORT_LABELS: Record<SortOption, string> = {
	popular: 'Popular',
	'price-asc': 'Price: Low',
	'price-desc': 'Price: High',
	discount: 'Biggest Discount',
};

const PRICE_RANGES: readonly string[] = ['Under 80€', '80 – 120€', '120 – 160€', '160€+'];

function priceMatchesRange(price: number, range: string): boolean {
	if (range === 'Under 80€') return price < 80;
	if (range === '80 – 120€') return price >= 80 && price <= 120;
	if (range === '120 – 160€') return price > 120 && price <= 160;
	if (range === '160€+') return price > 160;
	return true;
}

@Component({
	selector: 'app-filter-bar',
	templateUrl: './filter-bar.component.html',
	styleUrls: ['./filter-bar.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		MatChipsModule,
		MatIconModule,
		MatMenuModule,
		MatButtonModule,
		MatBottomSheetModule,
	],
})
export class FilterBarComponent {
	private readonly bottomSheet = inject(MatBottomSheet);

	/** All products (unfiltered) from the parent. */
	readonly products = input.required<readonly Product[]>();

	/** Emits the filtered + sorted product list whenever filters change. */
	readonly filteredProducts = output<readonly Product[]>();

	// ── Sort ──
	protected readonly sortBy = signal<SortOption>('popular');
	protected readonly sortLabel = computed(() => SORT_LABELS[this.sortBy()]);
	protected readonly sortOptions: SortOption[] = ['popular', 'price-asc', 'price-desc', 'discount'];
	protected readonly SORT_LABELS = SORT_LABELS;

	// ── Filter state ──
	protected readonly activeBrands = signal<Set<string>>(new Set());
	protected readonly activeCategories = signal<Set<string>>(new Set());
	protected readonly activeSizes = signal<Set<string>>(new Set());
	protected readonly activePriceRanges = signal<Set<string>>(new Set());
	protected readonly onSaleOnly = signal(false);
	protected readonly highRatedOnly = signal(false);

	// ── Derived option lists ──
	protected readonly brands = computed(() => {
		const names = this.products()
			.map((p) => p.companyName ?? '')
			.filter((n) => n.length > 0);
		return [...new Set(names)].sort();
	});

	protected readonly categories = computed(() => {
		const cats = this.products().flatMap((p) => p.category ?? []);
		return [...new Set(cats)].sort();
	});

	protected readonly allSizes = computed(() => {
		const sizes = this.products().flatMap((p) =>
			p.variants.flatMap((v) => v.sizes.map((s) => String(s))),
		);
		return [...new Set(sizes)].sort((a, b) => Number(a) - Number(b));
	});

	// ── Chip labels ──
	protected readonly brandLabel = computed(() => {
		const s = this.activeBrands();
		if (s.size === 0) return 'Brand';
		if (s.size === 1) return [...s][0];
		return `Brand (${s.size})`;
	});

	protected readonly categoryLabel = computed(() => {
		const s = this.activeCategories();
		if (s.size === 0) return 'Category';
		if (s.size === 1) return [...s][0];
		return `Category (${s.size})`;
	});

	protected readonly sizeLabel = computed(() => {
		const s = this.activeSizes();
		if (s.size === 0) return 'Size';
		if (s.size <= 2) return `Size: ${[...s].join(', ')}`;
		return `Size (${s.size})`;
	});

	protected readonly priceLabel = computed(() => {
		const s = this.activePriceRanges();
		if (s.size === 0) return 'Price';
		if (s.size === 1) return [...s][0];
		return `Price (${s.size})`;
	});

	protected readonly hasActiveFilters = computed(
		() =>
			this.activeBrands().size > 0 ||
			this.activeCategories().size > 0 ||
			this.activeSizes().size > 0 ||
			this.activePriceRanges().size > 0 ||
			this.onSaleOnly() ||
			this.highRatedOnly(),
	);

	/** The filtered + sorted result. */
	readonly displayedProducts = computed(() => {
		let list = [...this.products()];

		const brands = this.activeBrands();
		if (brands.size > 0) {
			list = list.filter((p) => brands.has(p.companyName ?? ''));
		}

		const cats = this.activeCategories();
		if (cats.size > 0) {
			list = list.filter((p) => p.category?.some((c) => cats.has(c)));
		}

		const sizes = this.activeSizes();
		if (sizes.size > 0) {
			list = list.filter((p) =>
				p.variants.some((v) => v.sizes.some((s) => sizes.has(String(s)))),
			);
		}

		const priceRanges = this.activePriceRanges();
		if (priceRanges.size > 0) {
			list = list.filter((p) => {
				const effectivePrice = p.discount ? p.price * (1 - p.discount / 100) : p.price;
				return [...priceRanges].some((r) => priceMatchesRange(effectivePrice, r));
			});
		}

		if (this.onSaleOnly()) {
			list = list.filter((p) => (p.discount ?? 0) > 0);
		}

		if (this.highRatedOnly()) {
			list = list.filter((p) => (p.rating ?? 0) >= 4);
		}

		switch (this.sortBy()) {
			case 'popular':
				list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
				break;
			case 'price-asc':
				list.sort((a, b) => a.price - b.price);
				break;
			case 'price-desc':
				list.sort((a, b) => b.price - a.price);
				break;
			case 'discount':
				list.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
				break;
		}

		return list;
	});

	protected readonly resultCount = computed(() => this.displayedProducts().length);

	// ── Actions ──

	protected setSort(option: SortOption): void {
		this.sortBy.set(option);
	}

	protected toggleOnSale(): void {
		this.onSaleOnly.update((v) => !v);
	}

	protected toggleHighRated(): void {
		this.highRatedOnly.update((v) => !v);
	}

	protected clearAll(): void {
		this.activeBrands.set(new Set());
		this.activeCategories.set(new Set());
		this.activeSizes.set(new Set());
		this.activePriceRanges.set(new Set());
		this.onSaleOnly.set(false);
		this.highRatedOnly.set(false);
	}

	// ── Bottom sheet openers ──

	protected openBrandFilter(): void {
		this.openSheet('Brand', this.brands(), this.activeBrands(), (r) => this.activeBrands.set(r));
	}

	protected openCategoryFilter(): void {
		this.openSheet('Category', this.categories(), this.activeCategories(), (r) => this.activeCategories.set(r));
	}

	protected openSizeFilter(): void {
		this.openSheet('Size', this.allSizes(), this.activeSizes(), (r) => this.activeSizes.set(r));
	}

	protected openPriceFilter(): void {
		this.openSheet('Price', [...PRICE_RANGES], this.activePriceRanges(), (r) => this.activePriceRanges.set(r));
	}

	private openSheet(
		title: string,
		options: readonly string[],
		selected: ReadonlySet<string>,
		onApply: (result: Set<string>) => void,
	): void {
		const data: FilterSheetData = { title, options, selected };
		const ref = this.bottomSheet.open(FilterBottomSheetComponent, {
			data,
			panelClass: 'filter-sheet-panel',
		});

		ref.afterDismissed()
			.pipe(filter((result): result is FilterSheetResult => !!result))
			.subscribe((result) => onApply(result.selected));
	}
}
