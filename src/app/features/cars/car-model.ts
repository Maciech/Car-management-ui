import {CarStatus} from '../../shared/ui/enums/car-status.enum';

export interface Car {
  carId: number | null;
  brand: string;
  model: string;
  generation?: string;
  productionYear: number;
  mileage: number;
  kwPower: number;
  purchasePrice: number;
  salePrice?: number;
  isSold: boolean;
  isImported: boolean;
  isDamaged: boolean;
  status?: CarStatus;
  images: string[];
}
