export interface Car {
  carId: number;
  brand: string;
  model: string;
  productionYear: number;
  purchasePrice: number;
  salePrice?: number;
  isSold: boolean;
  images: string[];
}
