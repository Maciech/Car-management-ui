import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Invitation} from './invitation.model';
import {environment} from '../../../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class InvitationService {
  private readonly base = `${environment.apiUrl}/api/invite`;

  constructor(private http: HttpClient) {}

  getByCarId(carId: number): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(`${this.base}/car/${carId}`);
  }

  resend(invitationId: number): Observable<void> {
    return this.http.post<void>(`${this.base}/${invitationId}/resend`, {});
  }

  invite(carId: number, carName: string, emails: string[]): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/email/invite`, {carId, carName, emails});
  }
}
