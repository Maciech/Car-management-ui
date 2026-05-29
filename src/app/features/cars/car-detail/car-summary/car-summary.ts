import {Component, Input} from '@angular/core';
import {Car} from '../../car-model';
import {DecimalPipe} from '@angular/common';
import {CAR_STATUS_CSS, CAR_STATUS_LABELS, CarStatus} from '../../../../shared/ui/enums/car-status.enum';

@Component({
  selector: 'app-car-summary',
  imports: [DecimalPipe],
  templateUrl: './car-summary.html',
  styleUrl: './car-summary.css',
})
export class CarSummary {
  @Input() car!: Car;

  get statusLabel(): string {
    const status = this.car.status ?? (this.car.isSold ? CarStatus.SPRZEDANE : CarStatus.GOTOWE);
    return CAR_STATUS_LABELS[status];
  }

  get statusCss(): string {
    const status = this.car.status ?? (this.car.isSold ? CarStatus.SPRZEDANE : CarStatus.GOTOWE);
    return CAR_STATUS_CSS[status];
  }
}
