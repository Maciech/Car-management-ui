import {Component, Input} from '@angular/core';
import {Car} from '../car-model';

@Component({
  selector: 'app-car-card',
  imports: [],
  templateUrl: './car-card.html',
  styleUrl: './car-card.css',
})
export class CarCard {
  @Input({ required: true }) car!: Car;

  get isSold() {
    return this.car.isSold;
  }
}
