import {Component, inject, Input} from '@angular/core';
import {Car} from '../car-model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-car-card',
  imports: [],
  templateUrl: './car-card.html',
  styleUrl: './car-card.css',
})
export class CarCard {
  router = inject(Router);
  @Input({ required: true }) car!: Car;

  get isSold() {
    return this.car.isSold;
  }

  open() {
    this.router.navigate(['/cars', this.car.carId]);
  }
}
