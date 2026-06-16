import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
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
  private carService = inject(CarService);
  private router     = inject(Router);

  showAddCar = signal(false);
  cars       = signal<Car[]>([]);

  constructor() { this.load(); }

  load() {
    this.carService.getAll().subscribe({
      next: cars => this.cars.set(cars),
      error: ()  => this.cars.set([]),
    });
  }

  listedCars() {
    return this.cars()
      .filter(c => c.status === 'WYSTAWIONE')
      .slice(0, 3);
  }

  bestSoldCars() {
    return this.cars()
      .filter(c => c.status === 'SPRZEDANE' && c.salePrice && c.purchasePrice)
      .sort((a, b) => {
        const invested = (c: typeof a) => c.purchasePrice! + (c.totalExpenses ?? 0);
        const marginA = (a.salePrice! - invested(a)) / invested(a);
        const marginB = (b.salePrice! - invested(b)) / invested(b);
        return marginB - marginA;
      })
      .slice(0, 3);
  }

  readyCars() {
    return this.cars()
      .filter(c => c.status === 'GOTOWE')
      .slice(0, 3);
  }

  openAddCar()  { this.showAddCar.set(true); }
  closeAddCar() { this.showAddCar.set(false); }
  onCarAdded()  { this.showAddCar.set(false); this.load(); }

  showAllListed() { this.router.navigate(['/cars'], {queryParams: {status: 'WYSTAWIONE'}}); }
  showAllSold()   { this.router.navigate(['/cars'], {queryParams: {status: 'SPRZEDANE'}}); }
  showAllReady()  { this.router.navigate(['/cars'], {queryParams: {status: 'GOTOWE'}}); }
}
