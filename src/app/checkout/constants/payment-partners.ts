import { PaymentPartner } from '../types/checkout.types';

export const PAYMENT_PARTNERS: readonly PaymentPartner[] = [
	{ name: 'MasterCard', logo: 'assets/images/logos/payment-methods/mastercard-logo.png' },
	{ name: 'Visa', logo: 'assets/images/logos/payment-methods/Visa-logo.png' },
	{ name: 'Paypal', logo: 'assets/images/logos/payment-methods/paypal-logo.jpg' },
] as const;
