import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class MailService {
  private apiUrl = environment.apiUrl + '/api/email';

  constructor(private http: HttpClient) {}

  sendInvite(carId: number, carName: string, emails: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/invite`, {carId, carName, emails});
  }
}
