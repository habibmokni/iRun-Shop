import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Product } from '../../products/types/product.types';
import { ProductService } from '../../products/services/product.service';

/**
 * Admin-only page for manually adding products to the database.
 * Used during development/seeding — not part of the customer-facing app.
 */
@Component({
	selector: 'app-add-products-page',
	templateUrl: './add-products-page.component.html',
	styleUrls: ['./add-products-page.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ReactiveFormsModule,
		MatInputModule,
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
	],
})
export class AddProductsPageComponent {
	private readonly productService = inject(ProductService);

	protected readonly variants = new FormArray<FormGroup>([]);

	protected readonly form = new FormGroup({
		companyName: new FormControl(''),
		modelNo: new FormControl(''),
		name: new FormControl(''),
		category: new FormControl<string[]>([]),
		subCategory: new FormControl<string[]>([]),
		price: new FormControl(0),
		variants: this.variants,
	});

	protected onAddVariants(): void {
		const variantGroup = new FormGroup({
			variantId: new FormControl(''),
			sizes: new FormArray([new FormControl()]),
			inStock: new FormArray([new FormControl()]),
			imageList: new FormArray([new FormControl()]),
		});
		this.variants.push(variantGroup);
	}

	protected onAddSizes(index: number): void {
		const variantGroup = this.variants.at(index);
		const sizesArray = variantGroup.get('sizes') as FormArray;
		const inStockArray = variantGroup.get('inStock') as FormArray;
		sizesArray.push(new FormControl());
		inStockArray.push(new FormControl());
	}

	protected onSubmit(): void {
		const formValue = this.form.getRawValue();

		const product: Product = {
			id: Math.floor(Math.random() * 100),
			companyName: formValue.companyName ?? '',
			modelNo: formValue.modelNo ?? '',
			name: formValue.name ?? '',
			category: formValue.category ?? [],
			subCategory: formValue.subCategory ?? [],
			imageList: [],
			price: formValue.price ?? 0,
			variants: formValue.variants as Product['variants'],
		};

		this.productService.addProduct(product);
	}
}
