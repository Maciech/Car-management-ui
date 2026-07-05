import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth/auth-service';
import {CarSearchService, SearchCriteria} from '../cars/car-search-service';
import {CarService} from '../cars/car-service';
import {Car} from '../cars/car-model';
import {CarCard} from '../cars/car-card/car-card';
import {ThemeService} from '../../core/theme/theme.service';
import {CAR_COLOR_LABELS, CarColor} from '../../shared/ui/enums/car-color.enum';
import {CAR_GENERATIONS, CarGeneration} from '../../shared/data/car-generations';

@Component({
  selector: 'app-marketplace',
  imports: [ReactiveFormsModule, CarCard, RouterLink],
  templateUrl: './marketplace.html',
  styleUrl: './marketplace.css',
})
export class Marketplace implements OnInit {
  private fb            = inject(FormBuilder);
  private searchService = inject(CarSearchService);
  protected carService  = inject(CarService);
  protected auth        = inject(AuthService);
  protected theme       = inject(ThemeService);
  private router        = inject(Router);

  readonly colorOptions = Object.values(CarColor).map(v => ({value: v, label: CAR_COLOR_LABELS[v]}));
  generationOptions     = signal<CarGeneration[]>([]);
  yearRange             = signal<{minYear: number; maxYear: number} | null>(null);

  results   = signal<Car[]>([]);
  loading   = signal(false);
  menuOpen  = signal(false);

  form = this.fb.group({
    brand:      [''],
    generation: [''],
    model:      [''],
    color:      [''],
    minYear:    [null as number | null],
    maxYear:    [null as number | null],
    minPrice:   [null as number | null],
    maxPrice:   [null as number | null],
    minMileage: [null as number | null],
    maxMileage: [null as number | null],
    minPower:   [null as number | null],
    maxPower:   [null as number | null],
  });

  ngOnInit() {
    this.carService.loadMakes();
    this.load({});
  }

  private load(criteria: SearchCriteria) {
    this.loading.set(true);
    this.searchService.search(criteria).subscribe({
      next: cars => { this.results.set(cars.filter(c => c.status === 'WYSTAWIONE')); this.loading.set(false); },
      error: ()  => { this.results.set([]); this.loading.set(false); },
    });
  }

  search() {
    const raw = this.form.getRawValue();
    const criteria: SearchCriteria = {};
    Object.entries(raw).forEach(([k, v]) => {
      if (v !== null && v !== '') (criteria as Record<string, unknown>)[k] = v;
    });
    this.load(criteria);
  }

  reset() {
    this.form.reset();
    this.generationOptions.set([]);
    this.yearRange.set(null);
    this.load({});
  }

  onBrandChange(event: Event) {
    const brand = (event.target as HTMLInputElement).value.trim();
    this.form.patchValue({generation: '', model: ''});
    this.generationOptions.set(CAR_GENERATIONS[brand] ?? []);
    this.yearRange.set(null);
  }

  onGenerationChange(event: Event) {
    const code = (event.target as HTMLInputElement).value.trim();
    const brand = this.form.getRawValue().brand?.trim() ?? '';
    this.form.patchValue({minYear: null, maxYear: null});
    const gen = (CAR_GENERATIONS[brand] ?? []).find(g => g.code === code);
    if (!gen) { this.yearRange.set(null); return; }
    this.yearRange.set({minYear: gen.minYear, maxYear: gen.maxYear});
    this.form.patchValue({minYear: gen.minYear, maxYear: gen.maxYear});
  }

  get userInitials(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (payload.sub as string)?.[0]?.toUpperCase() ?? '?';
    } catch { return '?'; }
  }

  get userEmail(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub as string;
    } catch { return ''; }
  }

  logout() {
    this.auth.logout();
    this.menuOpen.set(false);
    window.location.reload();
  }

  goToDashboard() { this.router.navigate(['/dashboard']); }
  goToProfile()   { this.router.navigate(['/profile']); }
  closeMenu()     { this.menuOpen.set(false); }
  toggleMenu()    { this.menuOpen.update(v => !v); }
}
