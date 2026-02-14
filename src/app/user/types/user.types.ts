import { Store } from '../../stores/types/store.types';

export interface User {
	readonly name?: string;
	readonly firstName?: string;
	readonly lastName?: string;
	readonly email?: string;
	readonly password?: string;
	readonly address?: string;
	readonly zipCode?: string;
	storeSelected?: Store;
}
