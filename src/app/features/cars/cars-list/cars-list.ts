import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CarService} from '../car-service';
import {Car} from '../car-model';
import {CarCard} from '../car-card/car-card';
import {AddCarModal} from '../add-car-modal/add-car-modal';
import {CarStatus, CAR_STATUS_LABELS} from '../../../shared/ui/enums/car-status.enum';

type FilterKey = 'WSZYSTKIE' | 'AKTYWNE' | CarStatus;

interface FilterOption {
  key: FilterKey;
  label: string;
}

@Component({
  selector: 'app-cars-list',
  imports: [CarCard, AddCarModal],
  templateUrl: './cars-list.html',
  styleUrl: './cars-list.css',
})
export class CarsList implements OnInit {
  private carService = inject(CarService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  allCars = signal<Car[]>([]);
  activeFilter = signal<FilterKey>('WSZYSTKIE');
  showAddCar = signal(false);

  readonly filters: FilterOption[] = [
    {key: 'WSZYSTKIE', label: 'Wszystkie'},
    {key: 'AKTYWNE', label: 'Aktywne'},
    {key: CarStatus.W_NAPRAWIE, label: CAR_STATUS_LABELS[CarStatus.W_NAPRAWIE]},
    {key: CarStatus.GOTOWE, label: CAR_STATUS_LABELS[CarStatus.GOTOWE]},
    {key: CarStatus.WYSTAWIONE, label: CAR_STATUS_LABELS[CarStatus.WYSTAWIONE]},
    {key: CarStatus.SPRZEDANE, label: CAR_STATUS_LABELS[CarStatus.SPRZEDANE]},
  ];

  filteredCars = computed(() => {
    const filter = this.activeFilter();
    const cars = this.allCars();
    if (filter === 'WSZYSTKIE') return cars;
    if (filter === 'AKTYWNE') return cars.filter(c => !c.isSold);
    return cars.filter(c => {
      const status = c.status ?? (c.isSold ? CarStatus.SPRZEDANE : CarStatus.GOTOWE);
      return status === filter;
    });
  });

  get pageTitle(): string {
    const opt = this.filters.find(f => f.key === this.activeFilter());
    return opt ? opt.label : 'Samochody';
  }

  ngOnInit() {
    const status = this.route.snapshot.queryParamMap.get('status') as FilterKey | null;
    if (status) this.activeFilter.set(status);
    this.load();
  }

  load() {
    this.carService.getAll().subscribe({
      next: cars => this.allCars.set(cars),
    });
  }

  setFilter(key: FilterKey) {
    this.activeFilter.set(key);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: key === 'WSZYSTKIE' ? {} : {status: key},
      queryParamsHandling: 'replace',
    });
  }

  openAddCar() { this.showAddCar.set(true); }
  closeAddCar() { this.showAddCar.set(false); }
}
