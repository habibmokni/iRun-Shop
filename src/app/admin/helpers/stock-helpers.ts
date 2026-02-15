import { Product } from 'src/app/products/types/product.types';

/** Pick 2-3 images from a pool starting at an offset so each product looks different. */
export function imgs(pool: string[], offset: number, count = 3): string[] {
	const result: string[] = [];
	for (let i = 0; i < count; i++) {
		result.push(pool[(offset + i) % pool.length]);
	}
	return result;
}

// ─── Seed stores (6) ────────────────────────────────────────────────
// Each store carries a subset of products with store-specific stock levels.

export function withStock(product: Product, stockMultiplier: number): Product {
	return {
		...product,
		variants: product.variants.map((variant) => ({
			...variant,
			inStock: variant.inStock.map((qty) => Math.round(qty * stockMultiplier)),
		})),
	};
}
