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
    variantId: string;
    imageList: string[];
    sizes: number[],
    inStock: number[]
  }[];
  imageList?: string[];
  rating?: number;
  reviews?: number;
  description?: string;
}
