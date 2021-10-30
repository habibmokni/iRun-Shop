import { Product } from "./product.model";
import { Location } from "./location.model"

export interface Store{
  id: string;
  name: string;
  address: string;
  reviews?: string;
  description?: string;
  location: Location;
  products: Product[];
  openingTime: {
    open: string;
    close: string;
  }
  isDefaultStore: boolean;
}
