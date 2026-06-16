import {CarStatus} from '../../shared/ui/enums/car-status.enum';
import {CarColor} from '../../shared/ui/enums/car-color.enum';

export interface Car {
  carId: number | null;

  brand: string;
  model: string;
  generation?: string;

  color: CarColor;
  productionYear: number;
  vinNumber: string;
  mileage: number;
  kWPower: number;
  engineCapacity: number;

  isImported?: boolean;
  isDamaged: boolean;
  numberOfPreviousOwners: number;
  description: string;

  purchasePrice?: number;
  salePrice?: number;
  isSold: boolean;

  status?: CarStatus;
  images: string[];
  totalExpenses?: number;
}
