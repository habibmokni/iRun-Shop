import { PaymentPartner } from '../types/checkout.types';

export const PAYMENT_PARTNERS: readonly PaymentPartner[] = [
	{ name: 'MasterCard', logo: 'assets/images/logos/mastercard-logo.png' },
	{ name: 'Visa', logo: 'assets/images/logos/Visa-logo.png' },
	{ name: 'Paypal', logo: 'assets/images/logos/paypal-logo.jpg' },
] as const;
