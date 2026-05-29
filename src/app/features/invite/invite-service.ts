import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface InvitationInfo {
  carId: number;
  carName: string;
  inviteeEmail: string;
  status: 'PENDING' | 'ACCEPTED';
}

@Injectable({providedIn: 'root'})
export class InviteService {
  private readonly BASE = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getInvitation(token: string): Observable<InvitationInfo> {
    return this.http.get<InvitationInfo>(`${this.BASE}/api/invite`, {params: {token}});
  }

  acceptInvitation(token: string): Observable<void> {
    return this.http.post<void>(`${this.BASE}/api/invite/accept`, {token});
  }
}
