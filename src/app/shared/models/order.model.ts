import { Billing } from "./billing.model";
import { CartProduct } from "./cartProduct.model";


export interface Order{
  orderId: number;
  billingDetails: Billing;
  productsOrdered: CartProduct[];
  storeLocation: {
    id: number;
    address: string;
  }
  pickupType: string;
  pickupDate: Date;
  pickupTime?: string;
  paymentOption: String;
}
