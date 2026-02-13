export interface CartProduct {
	modelNo: string;
	vendor: string;
	productName: string;
	productImage: string;
	size: number;
	price: number;
	variantId: string;
	noOfItems: number;
	color?: string;
}
