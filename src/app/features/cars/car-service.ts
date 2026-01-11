import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {Car} from './car-model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarService {

  private readonly API = '/api/cars';
  private readonly HOST_URL = environment.apiUrl;

  loading = signal(false);

  constructor(private http: HttpClient) {}

  create(car: Car): Observable<void> {
    this.loading.set(true);

    return this.http.post<void>(this.HOST_URL + this.API, car).pipe(
      finalize(() => this.loading.set(false))
    );
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

}
