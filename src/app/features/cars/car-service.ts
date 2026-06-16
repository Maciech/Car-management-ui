import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {Car} from './car-model';
import {FinancialSummary} from './car-detail/car-tabs/profit-tab/financial-summary.model';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class CarService {

  private readonly API = '/api/cars';
  private readonly HOST_URL = environment.apiUrl;

  loading = signal(false);

  /** Cached makes — loaded once at shell init, available everywhere instantly */
  makes = signal<string[]>([]);
  private makesState: 'idle' | 'loading' | 'loaded' = 'idle';

  constructor(private http: HttpClient) {}

  /** Call once (from Shell). Subsequent calls are no-ops. */
  loadMakes(): void {
    if (this.makesState !== 'idle') return;
    this.makesState = 'loading';
    this.http.get<string[]>(this.HOST_URL + this.API + '/getAllMake').subscribe({
      next: makes => {
        this.makes.set([...makes].sort());
        this.makesState = 'loaded';
      },
      error: () => { this.makesState = 'idle'; }, // allow retry on error
    });
  }

  create(car: Car): Observable<{carId: number}> {
    this.loading.set(true);
    return this.http.post<{carId: number}>(this.HOST_URL + this.API, car).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  update(id: number, payload: object): Observable<Car> {
    return this.http.put<Car>(`${this.HOST_URL + this.API}/${id}`, payload);
  }

  getAll(): Observable<Car[]> {
    this.loading.set(true);
    return this.http.get<Car[]>(this.HOST_URL + this.API).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  getById(id: number): Observable<Car> {
    this.loading.set(true);
    return this.http.get<Car>(`${this.HOST_URL + this.API}/${id}`).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  getAllModelByMake(make: string): Observable<string[]> {
    return this.http.get<string[]>(this.HOST_URL + this.API + '/getAllModelByMake/' + encodeURIComponent(make));
  }

  getFinancialSummary(carId: number): Observable<FinancialSummary> {
    return this.http.get<FinancialSummary>(`${this.HOST_URL + this.API}/${carId}/financial-summary`);
  }

  getYearRange(make: string, model: string): Observable<{minYear: number; maxYear: number}> {
    return this.http.get<{minYear: number; maxYear: number}>(
      `${this.HOST_URL + this.API}/getYearRange`,
      {params: {make, model}}
    );
  }

  getTrims(make: string, modelLine: string, year: number): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.HOST_URL + this.API}/getTrims`,
      {params: {make, modelLine, year}}
    );
  }
}
