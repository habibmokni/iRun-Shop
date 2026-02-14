import {
	Component,
	ChangeDetectionStrategy,
	inject,
	signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

import { Product } from '../../products/types/product.types';
import { ProductService } from '../../products/services/product.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { SeedService } from '../services/seed.service';

@Component({
	selector: 'app-admin-products-page',
	templateUrl: './admin-products-page.component.html',
	styleUrls: ['./admin-products-page.component.css'],
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
		MatDividerModule,
		RouterLink,
	],
})
export class AdminProductsPageComponent {
	private readonly productService = inject(ProductService);
	private readonly snackbar = inject(SnackbarService);
	private readonly seedService = inject(SeedService);

	protected readonly isSeeding = signal(false);

	protected readonly products = toSignal(this.productService.productList, {
		initialValue: [] as Product[],
	});

	protected readonly displayedColumns = [
		'modelNo',
		'name',
		'companyName',
		'price',
		'variants',
		'actions',
	];

	protected readonly editing = signal<Product | null>(null);
	protected readonly showForm = signal(false);

	protected readonly variants = new FormArray<FormGroup>([]);

	protected readonly form = new FormGroup({
		companyName: new FormControl(''),
		modelNo: new FormControl('', [Validators.required]),
		name: new FormControl('', [Validators.required]),
		category: new FormControl(''),
		subCategory: new FormControl(''),
		price: new FormControl<number>(0, [Validators.required]),
		description: new FormControl(''),
		variants: this.variants,
	});

	protected onAdd(): void {
		this.editing.set(null);
		this.form.reset({ price: 0 });
		this.variants.clear();
		this.showForm.set(true);
	}

	protected onEdit(product: Product): void {
		this.editing.set(product);
		this.form.patchValue({
			companyName: product.companyName ?? '',
			modelNo: product.modelNo,
			name: product.name,
			category: product.category?.join(', ') ?? '',
			subCategory: product.subCategory?.join(', ') ?? '',
			price: product.price,
			description: product.description ?? '',
		});

		this.variants.clear();
		for (const variant of product.variants) {
			this.variants.push(
				new FormGroup({
					variantId: new FormControl(variant.variantId),
					sizes: new FormControl(variant.sizes.join(', ')),
					inStock: new FormControl(variant.inStock.join(', ')),
					imageList: new FormControl(variant.imageList.join(', ')),
				}),
			);
		}

		this.showForm.set(true);
	}

	protected onAddVariant(): void {
		this.variants.push(
			new FormGroup({
				variantId: new FormControl(''),
				sizes: new FormControl(''),
				inStock: new FormControl(''),
				imageList: new FormControl(''),
			}),
		);
	}

	protected onRemoveVariant(index: number): void {
		this.variants.removeAt(index);
	}

	protected onCancel(): void {
		this.showForm.set(false);
		this.editing.set(null);
		this.form.reset();
		this.variants.clear();
	}

	protected onSubmit(): void {
		if (this.form.invalid) return;
		const formValue = this.form.getRawValue();

		const parsedVariants = (formValue.variants ?? []).map((variant) => ({
			variantId: (variant['variantId'] as string) ?? '',
			sizes: this.parseNumberList((variant['sizes'] as string) ?? ''),
			inStock: this.parseNumberList((variant['inStock'] as string) ?? ''),
			imageList: this.parseStringList((variant['imageList'] as string) ?? ''),
		}));

		const product: Product = {
			id: this.editing()?.id ?? Math.floor(Math.random() * 100_000),
			companyName: formValue.companyName ?? '',
			modelNo: formValue.modelNo ?? '',
			name: formValue.name ?? '',
			category: this.parseStringList(formValue.category ?? ''),
			subCategory: this.parseStringList(formValue.subCategory ?? ''),
			price: formValue.price ?? 0,
			description: formValue.description ?? '',
			variants: parsedVariants,
		};

		const currentEditing = this.editing();
		if (currentEditing?.docId) {
			this.productService.updateProduct(currentEditing.docId, product);
			this.snackbar.success('Product updated');
		} else {
			this.productService.addProduct(product);
			this.snackbar.success('Product added');
		}

		this.onCancel();
	}

	protected onDelete(product: Product): void {
		if (!product.docId) return;
		if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

		this.productService.deleteProduct(product.docId);
		this.snackbar.success('Product deleted');
	}

	protected async onSeedDatabase(): Promise<void> {
		if (!confirm('This will DELETE all existing products and stores, then create sample data. Continue?')) {
			return;
		}

		this.isSeeding.set(true);
		try {
			const result = await this.seedService.seedDatabase();
			this.snackbar.success(
				`Database seeded: ${result.products} products, ${result.stores} stores`,
			);
		} catch (error: unknown) {
			console.error('Seed failed:', error);
			this.snackbar.error('Failed to seed database. Check console for details.');
		} finally {
			this.isSeeding.set(false);
		}
	}

	private parseNumberList(value: string): number[] {
		return value
			.split(',')
			.map((item) => item.trim())
			.filter((item) => item !== '')
			.map(Number);
	}

	private parseStringList(value: string): string[] {
		return value
			.split(',')
			.map((item) => item.trim())
			.filter((item) => item !== '');
	}
}
