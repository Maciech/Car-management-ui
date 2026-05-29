import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PortfolioStatistics} from './statistics.model';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class StatisticsService {
  private readonly API = environment.apiUrl + '/api/statistics';

  constructor(private http: HttpClient) {}

  getPortfolioStatistics(): Observable<PortfolioStatistics> {
    return this.http.get<PortfolioStatistics>(this.API);
  }
}
