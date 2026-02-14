import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Product } from '../../products/types/product.types';
import { Store } from '../../stores/types/store.types';

// ─── Image path helpers ──────────────────────────────────────────────
const IMG = 'assets/images/products';

function adidasImg(variant: string, file: string): string {
	return `${IMG}/adidas/ultraboost21/${variant}/big/${file}`;
}

function nikeJoyrideImg(variant: string, file: string): string {
	return `${IMG}/nike/NIKE-JOYRIDE-RUN-FLYKNIT/${variant}/big/${file}`;
}

function nikePegasusImg(variant: string, file: string): string {
	return `${IMG}/nike/NIKE-Pegasus-Trail-3/${variant}/big/${file}`;
}

function nbImg(model: string, file: string): string {
	return `${IMG}/new-balance/${model}/big/${file}`;
}

// ─── Seed products ───────────────────────────────────────────────────
const SEED_PRODUCTS: Product[] = [
	// ── Adidas Ultraboost 21 ──
	{
		id: 1,
		companyName: 'ADIDAS',
		name: 'Adidas Ultraboost 21',
		modelNo: 'UB21-FY0400',
		category: ['Running'],
		subCategory: ['Road Running'],
		price: 150.9,
		discount: 10,
		rating: 4.5,
		reviews: 128,
		description:
			'Experience incredible energy return with the Adidas Ultraboost 21. Featuring responsive BOOST midsole cushioning and a Primeknit+ upper that adapts to your foot.',
		variants: [
			{
				variantId: 'FY0400',
				imageList: [
					adidasImg('FY0400', 'big0.jpg'),
					adidasImg('FY0400', 'big1.jpg'),
				],
				sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [3, 5, 8, 10, 12, 10, 8, 6, 4, 2],
			},
		],
		imageList: [adidasImg('FY0400', 'big0.jpg'), adidasImg('FY0400', 'big1.jpg')],
	},
	{
		id: 2,
		companyName: 'ADIDAS',
		name: 'Adidas Ultraboost 21',
		modelNo: 'UB21-FY0409',
		category: ['Running'],
		subCategory: ['Road Running'],
		price: 131.9,
		discount: 15,
		rating: 4.3,
		reviews: 95,
		description:
			'The Ultraboost 21 in Clear Mint delivers the same responsive BOOST cushioning in a fresh colourway. Primeknit+ upper for adaptive comfort.',
		variants: [
			{
				variantId: 'FY0409',
				imageList: [
					adidasImg('FY0409', 'big0.jpeg'),
					adidasImg('FY0409', 'big1.jpeg'),
					adidasImg('FY0409', 'big2.jpeg'),
				],
				sizes: [36, 37, 38, 39, 40, 41, 42, 43],
				inStock: [2, 4, 6, 8, 7, 5, 3, 1],
			},
		],
		imageList: [adidasImg('FY0409', 'big0.jpeg'), adidasImg('FY0409', 'big1.jpeg')],
	},
	{
		id: 3,
		companyName: 'ADIDAS',
		name: 'Adidas Ultraboost 21',
		modelNo: 'UB21-FZ1917',
		category: ['Running'],
		subCategory: ['Road Running'],
		price: 131.9,
		discount: 15,
		rating: 4.4,
		reviews: 84,
		description:
			'Ultraboost 21 in Acid Orange. The same energy-returning BOOST technology in a bold statement colour.',
		variants: [
			{
				variantId: 'FZ1917',
				imageList: [
					adidasImg('FZ1917', 'big0.jpeg'),
					adidasImg('FZ1917', 'big1.jpeg'),
					adidasImg('FZ1917', 'big2.jpeg'),
				],
				sizes: [36, 37, 38, 39, 40, 41, 42, 43],
				inStock: [1, 3, 5, 7, 9, 6, 4, 2],
			},
		],
		imageList: [adidasImg('FZ1917', 'big0.jpeg'), adidasImg('FZ1917', 'big1.jpeg')],
	},

	// ── Nike Pegasus Trail 3 ──
	{
		id: 4,
		companyName: 'NIKE',
		name: 'Nike Pegasus Trail 3',
		modelNo: 'DA8698-001',
		category: ['Trail Running'],
		subCategory: ['All-Terrain'],
		price: 97.9,
		discount: 20,
		rating: 4.6,
		reviews: 210,
		description:
			'Built for trail running, the Nike Pegasus Trail 3 combines React foam with a rugged outsole for comfort and grip on varied terrain.',
		variants: [
			{
				variantId: 'DA8698-001',
				imageList: [
					nikePegasusImg('DA8698-001', 'big0.jpg'),
					nikePegasusImg('DA8698-001', 'big1.jpg'),
					nikePegasusImg('DA8698-001', 'big2.jpg'),
				],
				sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [5, 7, 10, 12, 15, 12, 10, 8, 5, 3],
			},
		],
		imageList: [nikePegasusImg('DA8698-001', 'big0.jpg'), nikePegasusImg('DA8698-001', 'big1.jpg')],
	},
	{
		id: 5,
		companyName: 'NIKE',
		name: 'Nike Pegasus Trail 3',
		modelNo: 'DA8698-300',
		category: ['Trail Running'],
		subCategory: ['All-Terrain'],
		price: 129.9,
		discount: 10,
		rating: 4.5,
		reviews: 175,
		description:
			'Pegasus Trail 3 in Dark Teal Green. React foam cushioning with rock-plate protection for confident trail running.',
		variants: [
			{
				variantId: 'DA8698-300',
				imageList: [
					nikePegasusImg('DA8698-300', 'big0.jpg'),
					nikePegasusImg('DA8698-300', 'big1.jpg'),
					nikePegasusImg('DA8698-300', 'big2.jpg'),
				],
				sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [3, 5, 8, 10, 11, 9, 7, 5, 3, 1],
			},
		],
		imageList: [nikePegasusImg('DA8698-300', 'big0.jpg'), nikePegasusImg('DA8698-300', 'big1.jpg')],
	},
	{
		id: 6,
		companyName: 'NIKE',
		name: 'Nike Pegasus Trail 3',
		modelNo: 'DA8698-600',
		category: ['Trail Running'],
		subCategory: ['All-Terrain'],
		price: 114.9,
		discount: 15,
		rating: 4.7,
		reviews: 190,
		description:
			'Pegasus Trail 3 in Light Soft Pink. Comfortable React foam and a multi-directional outsole for off-road confidence.',
		variants: [
			{
				variantId: 'DA8698-600',
				imageList: [nikePegasusImg('DA8698-600', 'big0.jpg')],
				sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [4, 6, 9, 11, 13, 10, 8, 6, 4, 2],
			},
		],
		imageList: [nikePegasusImg('DA8698-600', 'big0.jpg')],
	},

	// ── Nike Joyride Run Flyknit ──
	{
		id: 7,
		companyName: 'NIKE',
		name: 'Nike Joyride Run Flyknit',
		modelNo: 'AQ2731-601',
		category: ['Running'],
		subCategory: ['Road Running'],
		price: 139.9,
		discount: 20,
		rating: 4.2,
		reviews: 156,
		description:
			'The Nike Joyride Run Flyknit features tiny foam beads underfoot for an incredibly smooth, cushioned ride. Flyknit upper for breathable fit.',
		variants: [
			{
				variantId: 'AQ2731-601',
				imageList: [
					nikeJoyrideImg('AQ2731-601', 'big0.jpeg'),
					nikeJoyrideImg('AQ2731-601', 'big1.jpeg'),
					nikeJoyrideImg('AQ2731-601', 'big2.jpeg'),
				],
				sizes: [36, 37, 38, 39, 40, 41, 42],
				inStock: [2, 4, 6, 8, 6, 4, 2],
			},
		],
		imageList: [nikeJoyrideImg('AQ2731-601', 'big0.jpeg'), nikeJoyrideImg('AQ2731-601', 'big1.jpeg')],
	},
	{
		id: 8,
		companyName: 'NIKE',
		name: 'Nike Joyride Run Flyknit',
		modelNo: 'AQ2731-001',
		category: ['Running'],
		subCategory: ['Road Running'],
		price: 139.9,
		discount: 20,
		rating: 4.3,
		reviews: 140,
		description:
			'Joyride Run Flyknit in Black. Tiny foam beads provide a plush, adaptive ride with every step.',
		variants: [
			{
				variantId: 'AQ2731-001',
				imageList: [
					nikeJoyrideImg('AQ2731-001', 'big0.jpeg'),
					nikeJoyrideImg('AQ2731-001', 'big1.jpeg'),
					nikeJoyrideImg('AQ2731-001', 'big2.jpeg'),
				],
				sizes: [36, 37, 38, 39, 40, 41, 42],
				inStock: [3, 5, 7, 9, 7, 5, 3],
			},
		],
		imageList: [nikeJoyrideImg('AQ2731-001', 'big0.jpeg'), nikeJoyrideImg('AQ2731-001', 'big1.jpeg')],
	},
	{
		id: 9,
		companyName: 'NIKE',
		name: 'Nike Joyride Run Flyknit',
		modelNo: 'AQ2731-500',
		category: ['Running'],
		subCategory: ['Road Running'],
		price: 139.9,
		discount: 20,
		rating: 4.4,
		reviews: 112,
		description:
			'Joyride Run Flyknit in Purple. The same Joyride bead technology for soft, cushioned comfort.',
		variants: [
			{
				variantId: 'AQ2731-500',
				imageList: [
					nikeJoyrideImg('AQ2731-500', 'big0.jpeg'),
					nikeJoyrideImg('AQ2731-500', 'big1.jpeg'),
				],
				sizes: [36, 37, 38, 39, 40, 41, 42],
				inStock: [1, 3, 5, 7, 5, 3, 1],
			},
		],
		imageList: [nikeJoyrideImg('AQ2731-500', 'big0.jpeg')],
	},

	// ── New Balance ──
	{
		id: 10,
		companyName: 'NEW BALANCE',
		name: 'New Balance RC Elite v2',
		modelNo: 'NB-WRCELVB2',
		category: ['Racing'],
		subCategory: ['Competition'],
		price: 229.9,
		discount: 5,
		rating: 4.8,
		reviews: 67,
		description:
			'The FuelCell RC Elite v2 is built for race day. Full-length carbon fibre plate and FuelCell foam for maximum energy return.',
		variants: [
			{
				variantId: 'WRCELVB2',
				imageList: [
					nbImg('RC-Elite-v2', 'big0.jpg'),
					nbImg('RC-Elite-v2', 'big1.jpg'),
					nbImg('RC-Elite-v2', 'big2.jpg'),
				],
				sizes: [37, 38, 39, 40, 41, 42, 43],
				inStock: [2, 3, 5, 6, 5, 3, 1],
			},
		],
		imageList: [nbImg('RC-Elite-v2', 'big0.jpg'), nbImg('RC-Elite-v2', 'big1.jpg')],
	},
	{
		id: 11,
		companyName: 'NEW BALANCE',
		name: 'New Balance FuelCell TC',
		modelNo: 'NB-WRCXCP',
		category: ['Racing'],
		subCategory: ['Competition'],
		price: 199.9,
		discount: 10,
		rating: 4.6,
		reviews: 53,
		description:
			'The FuelCell TC combines a carbon fibre plate with FuelCell cushioning for a fast, smooth ride from start to finish.',
		variants: [
			{
				variantId: 'WRCXCP',
				imageList: [
					nbImg('TC-v1', 'big0.jpg'),
					nbImg('TC-v1', 'big1.jpg'),
					nbImg('TC-v1', 'big2.jpg'),
				],
				sizes: [37, 38, 39, 40, 41, 42, 43],
				inStock: [3, 4, 6, 7, 5, 4, 2],
			},
		],
		imageList: [nbImg('TC-v1', 'big0.jpg'), nbImg('TC-v1', 'big1.jpg')],
	},
];

// ─── Seed stores ─────────────────────────────────────────────────────
// Each store carries a subset of products with store-specific stock levels.

function withStock(product: Product, stockMultiplier: number): Product {
	return {
		...product,
		variants: product.variants.map((variant) => ({
			...variant,
			inStock: variant.inStock.map((qty) => Math.round(qty * stockMultiplier)),
		})),
	};
}

const SEED_STORES: Omit<Store, 'id'>[] = [
	{
		name: 'iRun Essen City',
		address: 'Kettwiger Straße 40, 45127 Essen',
		location: { lat: 51.4562, lng: 7.0131 },
		isDefaultStore: true,
		openingTime: { open: '09:00', close: '20:00' },
		description: 'Our flagship store in the heart of Essen city centre.',
		products: SEED_PRODUCTS.map((product) => withStock(product, 1)),
	},
	{
		name: 'iRun Mülheim',
		address: 'Schloßstraße 28, 45468 Mülheim an der Ruhr',
		location: { lat: 51.4277, lng: 6.8825 },
		isDefaultStore: false,
		openingTime: { open: '10:00', close: '19:00' },
		description: 'Conveniently located near Mülheim city centre.',
		// Carries 8 of 11 products with lower stock
		products: SEED_PRODUCTS.slice(0, 8).map((product) => withStock(product, 0.6)),
	},
	{
		name: 'iRun Oberhausen CentrO',
		address: 'Centroallee 1000, 46047 Oberhausen',
		location: { lat: 51.4894, lng: 6.8789 },
		isDefaultStore: false,
		openingTime: { open: '10:00', close: '21:00' },
		description: 'Find us in the CentrO shopping centre, one of Europe\'s largest.',
		// Carries all products with high stock
		products: SEED_PRODUCTS.map((product) => withStock(product, 1.5)),
	},
];

@Injectable({ providedIn: 'root' })
export class SeedService {
	private readonly db = inject(AngularFirestore);

	/**
	 * Seeds the Firestore database with sample products and stores.
	 * Clears existing data in both collections first.
	 */
	public async seedDatabase(): Promise<{ products: number; stores: number }> {
		// 1. Clear existing data
		await this.clearCollection('productList');
		await this.clearCollection('storeList');

		// 2. Seed products
		const productBatch = this.db.firestore.batch();
		for (const product of SEED_PRODUCTS) {
			const ref = this.db.firestore.collection('productList').doc();
			productBatch.set(ref, product);
		}
		await productBatch.commit();

		// 3. Seed stores
		const storeBatch = this.db.firestore.batch();
		for (const store of SEED_STORES) {
			const ref = this.db.firestore.collection('storeList').doc();
			storeBatch.set(ref, store);
		}
		await storeBatch.commit();

		return { products: SEED_PRODUCTS.length, stores: SEED_STORES.length };
	}

	private async clearCollection(path: string): Promise<void> {
		const snapshot = await this.db.firestore.collection(path).get();
		if (snapshot.empty) return;

		const batch = this.db.firestore.batch();
		for (const doc of snapshot.docs) {
			batch.delete(doc.ref);
		}
		await batch.commit();
	}
}
