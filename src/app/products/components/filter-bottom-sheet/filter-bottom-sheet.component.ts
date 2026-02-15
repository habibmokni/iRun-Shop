import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type FilterSheetData = Readonly<{
	title: string;
	options: readonly string[];
	selected: ReadonlySet<string>;
}>;

export type FilterSheetResult = Readonly<{
	selected: Set<string>;
}>;

@Component({
	selector: 'app-filter-bottom-sheet',
	templateUrl: './filter-bottom-sheet.component.html',
	styleUrls: ['./filter-bottom-sheet.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatChipsModule, MatButtonModule, MatIconModule],
})
export class FilterBottomSheetComponent {
	private readonly sheetRef = inject(
		MatBottomSheetRef<FilterBottomSheetComponent, FilterSheetResult>,
	);
	protected readonly data: FilterSheetData = inject(MAT_BOTTOM_SHEET_DATA);

	protected readonly selected = signal<Set<string>>(new Set(this.data.selected));

	protected toggle(option: string): void {
		this.selected.update((prev) => {
			const next = new Set(prev);
			if (next.has(option)) {
				next.delete(option);
			} else {
				next.add(option);
			}
			return next;
		});
	}

	protected isSelected(option: string): boolean {
		return this.selected().has(option);
	}

	protected clear(): void {
		this.selected.set(new Set());
	}

	protected apply(): void {
		this.sheetRef.dismiss({ selected: this.selected() });
	}

	protected close(): void {
		this.sheetRef.dismiss();
	}
}
