import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {CostModel} from './cost-model';
import {environment} from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CostsService {
  private readonly API = '/api/cars/expenses';
  private readonly HOST_URL = environment.apiUrl;
  loading = signal(false);
  constructor(private http: HttpClient) {}

  getAllCostsByCarId(carId: number): Observable<CostModel[]> {
    this.loading.set(true);
    return this.http.get<CostModel[]>(this.HOST_URL + this.API + '/' + carId).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  createCostForCar(cost: CostModel): Observable<CostModel> {
    this.loading.set(true);
    return this.http.post<CostModel>(this.HOST_URL + this.API, cost).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  editCostForCar(cost: CostModel): Observable<CostModel> {
    this.loading.set(true);
    return this.http.put<CostModel>(this.HOST_URL + this.API, cost).pipe(
      finalize(() => this.loading.set(false))
    );
  }
}
