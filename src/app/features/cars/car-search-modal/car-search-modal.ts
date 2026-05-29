import {Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {CarSearchService, SearchCriteria} from '../car-search-service';
import {CarService} from '../car-service';
import {Car} from '../car-model';
import {CarCard} from '../car-card/car-card';
import {CAR_GENERATIONS, CarGeneration} from '../../../shared/data/car-generations';

export const CAR_COLORS = [
  {value: 'WHITE', label: 'Biały'},
  {value: 'BLACK', label: 'Czarny'},
  {value: 'SILVER', label: 'Srebrny'},
  {value: 'NAVY_BLUE', label: 'Granatowy'},
  {value: 'BLUE', label: 'Niebieski'},
  {value: 'RED', label: 'Czerwony'},
  {value: 'YELLOW', label: 'Żółty'},
  {value: 'GREEN', label: 'Zielony'},
  {value: 'ORANGE', label: 'Pomarańczowy'},
];

@Component({
  selector: 'app-car-search-modal',
  imports: [ReactiveFormsModule, CarCard],
  templateUrl: './car-search-modal.html',
  styleUrl: './car-search-modal.css',
})
export class CarSearchModal {
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private searchService = inject(CarSearchService);
  carService = inject(CarService);          // public — used in template for makes signal

  colors = CAR_COLORS;
  generationOptions = signal<CarGeneration[]>([]);
  yearRange = signal<{minYear: number; maxYear: number} | null>(null);

  results = signal<Car[] | null>(null);
  loading = signal(false);
  searched = signal(false);

  form = this.fb.group({
    brand: [''],
    generation: [''],
    model: [''],
    color: [''],
    minYear: [null as number | null],
    maxYear: [null as number | null],
    minPrice: [null as number | null],
    maxPrice: [null as number | null],
    minMileage: [null as number | null],
    maxMileage: [null as number | null],
    minPower: [null as number | null],
    maxPower: [null as number | null],
    isImported: [null as boolean | null],
    isDamaged: [null as boolean | null],
  });

  onBrandChange(event: Event) {
    const brand = (event.target as HTMLInputElement).value.trim();
    this.form.patchValue({generation: '', model: '', minYear: null, maxYear: null});
    this.generationOptions.set(CAR_GENERATIONS[brand] ?? []);
    this.yearRange.set(null);
  }

  onGenerationChange(event: Event) {
    const code = (event.target as HTMLInputElement).value.trim();
    const brand = this.form.getRawValue().brand?.trim() ?? '';
    this.form.patchValue({minYear: null, maxYear: null});
    this.yearRange.set(null);

    const gen = (CAR_GENERATIONS[brand] ?? []).find(g => g.code === code);
    if (!gen) return;

    this.yearRange.set({minYear: gen.minYear, maxYear: gen.maxYear});
    this.form.patchValue({minYear: gen.minYear, maxYear: gen.maxYear});
  }

  search() {
    const raw = this.form.getRawValue();
    const criteria: SearchCriteria = {};
    Object.entries(raw).forEach(([k, v]) => {
      if (v !== null && v !== '') (criteria as any)[k] = v;
    });
    this.loading.set(true);
    this.searched.set(true);
    this.searchService.search(criteria).subscribe({
      next: cars => { this.results.set(cars); this.loading.set(false); },
      error: () => { this.results.set([]); this.loading.set(false); },
    });
  }

  reset() {
    this.form.reset();
    this.generationOptions.set([]);
    this.yearRange.set(null);
    this.results.set(null);
    this.searched.set(false);
  }
}
