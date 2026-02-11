import { Billing } from "./billing.model";
import { CartProduct } from "./cart-product.model";


export interface Order{
  orderId: number;
  billingDetails: Billing;
  productsOrdered: CartProduct[];
  storeLocation: {
    id: number;
    address: string | null;
  }
  pickupType: string | null;
  pickupDate: Date | null;
  pickupTime?: string | null;
  paymentOption: String | null;
  orderPrice: number | null;
}
