export interface Product{
  companyName?: string;
  id?: number;
  modelNo?: string;
  name: string;
  category?: string[];
  subCategory: string[];
  price: number;
  discount?: number;
  variants:{
    color: string;
    sizes: number[],
    inStock: number[]
  }[];
  noOfItems?: number,
  productImage?: string,
  color?: string,
  size?: number,
  imageList: string[];
  rating?: number;
  reviews?: number;
  description?: string;
}
