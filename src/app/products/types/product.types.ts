export interface Product {
	companyName?: string;
	/** Application-level ID (set manually). */
	id: number;
	/** Firestore document ID (populated at read time). */
	docId?: string;
	modelNo: string;
	name: string;
	category: string[];
	subCategory?: string[];
	price: number;
	discount?: number;
	variants: {
		variantId: string;
		imageList: string[];
		sizes: number[];
		inStock: number[];
	}[];
	imageList?: string[];
	rating?: number;
	reviews?: number;
	description?: string;
}
