import { Store } from '../../stores/types/store.types';
import { Order } from '../../checkout/types/checkout.types';

export interface User {
	readonly name?: string;
	readonly firstName?: string;
	readonly lastName?: string;
	readonly email?: string;
	readonly address?: string;
	readonly zipCode?: string;
	storeSelected?: Store;
	favoriteStore?: Store;
	wishlist?: string[];
	orders?: Order[];
}
