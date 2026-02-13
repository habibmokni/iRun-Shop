import { Product } from "../../products/types/product.types";
import { Location } from "./location.types";

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
