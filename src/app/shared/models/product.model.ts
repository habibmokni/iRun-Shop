export interface Product{
  companyName?: string;
  id: number;
  modelNo: string;
  name: string;
  category: string[];
  subCategory?: string[];
  price: number;
  discount?: number;
  variants:{
    variantNo: string;
    sizes: number[],
    inStock: number[]
  }[];
  imageList: string[];
  rating?: number;
  reviews?: number;
  description?: string;
}
