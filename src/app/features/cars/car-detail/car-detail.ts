import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CarService} from '../car-service';
import {Car} from '../car-model';
import {CarTabs} from './car-tabs/car-tabs';
import {CarSummary} from './car-summary/car-summary';
import {CarGallery} from './car-gallery/car-gallery';

@Component({
  selector: 'app-car-detail',
  imports: [CarSummary, CarGallery, CarTabs],
  templateUrl: './car-detail.html',
  styleUrl: './car-detail.css',
})
export class CarDetail implements OnInit {
  car = signal<Car | null>(null);
  loading = signal(true);

  private carsService = inject(CarService);
  private route = inject(ActivatedRoute);



  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    const carId = Number(this.route.snapshot.paramMap.get('id'));
    this.carsService.getById(carId).subscribe({
      next: (car) => {
        this.car.set(car);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
