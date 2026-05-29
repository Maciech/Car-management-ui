import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Car} from './car-model';
import {environment} from '../../../environments/environment';

export interface SearchCriteria {
  brand?: string;
  model?: string;
  generation?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minPower?: number;
  maxPower?: number;
  minMileage?: number;
  maxMileage?: number;
  isImported?: boolean;
  isDamaged?: boolean;
}

@Injectable({providedIn: 'root'})
export class CarSearchService {
  private readonly API = environment.apiUrl + '/api/car-search/search';

  constructor(private http: HttpClient) {}

  search(criteria: SearchCriteria): Observable<Car[]> {
    let params = new HttpParams();
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<Car[]>(this.API, {params});
  }
}
