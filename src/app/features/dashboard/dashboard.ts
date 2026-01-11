import {Component, signal} from '@angular/core';
import {StatsSection} from './components/stats-section/stats-section';

import {AddCarModal} from '../cars/add-car-modal/add-car-modal';
import {Car} from '../cars/car-model';
import {CarService} from '../cars/car-service';
import {CarCard} from '../cars/car-card/car-card';

@Component({
  selector: 'app-dashboard',
  imports: [StatsSection, CarCard, AddCarModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  showAddCar = signal(false);

  cars = signal<Car[]>([]);

  constructor(private carService: CarService) {
    this.carService.getAll().subscribe({
      next: (cars) => {
        this.cars.set(cars);
      },
      error: () => {
        // Obsługa błędu ładowania samochodów
        this.cars.set([]);
      },
    });
  }

  activeCars() {
    return this.cars().filter(c => !c.isSold).slice(0, 3);
  }

  soldCars() {
    return this.cars().filter(c => c.isSold).slice(0, 3);
  }

  openAddCar() {
    this.showAddCar.set(true);
  }

  closeAddCar() {
    this.showAddCar.set(false);
  }
}
