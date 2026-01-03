import {Injectable, Input, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CostModel} from './cost-model';

@Injectable({
  providedIn: 'root',
})
export class CostsService {
  private readonly API = '/api/cars/expenses';
  private readonly HOST_URL = 'http://localhost:8080';
  loading = signal(false);
  constructor(private http: HttpClient) {}

  getAllCostsByCarId(carId: number) {
    this.loading.set(true);
    return this.http.get<CostModel[]>(this.HOST_URL + this.API + '/' + carId);
  }

  createCostForCar(cost: CostModel) {
    this.loading.set(true);
    return this.http.post<CostModel>(this.HOST_URL + this.API, cost);
  }

  editCostForCar(cost: CostModel) {
    this.loading.set(true);
    return this.http.put<CostModel>(this.HOST_URL + this.API, cost);
  }
}
