import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {finalize} from 'rxjs';
import {Car} from './car-model';

@Injectable({
  providedIn: 'root',
})
export class CarService {

  private readonly API = '/api/cars';
  private readonly HOST_URL = 'http://localhost:8080';

  loading = signal(false);

  constructor(private http: HttpClient) {}

  create(car: Car) {
    this.loading.set(true);

    return this.http.post<void>(this.HOST_URL + this.API, car).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  getAll() {
    this.loading.set(true);

    return this.http.get<Car[]>(this.HOST_URL + this.API);
  }

}
