import { CartProduct } from '../../cart/types/cart.types';

export type BillingDetails = Readonly<{
	name: string | null;
	email: string | null;
	phoneNo: string | null;
	address1: string | null;
}>;

export type StoreLocation = Readonly<{
	id: string | null;
	address: string | null;
}>;

export type Order = Readonly<{
	orderId: number;
	billingDetails: BillingDetails;
	productsOrdered: CartProduct[];
	storeLocation: StoreLocation;
	pickupType: string | null;
	pickupDate: Date | null;
	pickupTime: string | null;
	paymentOption: string | null;
	orderPrice: number;
}>;

export type PaymentPartner = Readonly<{
	name: string;
	logo: string;
}>;

export type StockCheckResult = Readonly<{
	onlineStock: readonly number[];
	unavailableItems: readonly CartProduct[];
	allAvailable: boolean;
}>;

export type DeliveryType = 'Click & Collect' | 'Home Delivery';

export type BillingFormValue = Readonly<{
	name: string | null;
	email: string | null;
	phoneNo: string | null;
	address1: string | null;
}>;

export type ShippingFormValue = Readonly<{
	type: DeliveryType | null;
	pickupDate: Date | null;
	shippingAddress: string | null;
	selectedTime: string | null;
}>;

export type PaymentFormValue = Readonly<{
	paymentOption: string | null;
}>;
