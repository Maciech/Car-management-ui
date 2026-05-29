import {inject, Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {RegisterDto} from './register/register.component/register.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API = '/api';
  private readonly HOST_URL = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  private loggedIn = signal<boolean>(false);
  private loading = signal(false);

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  login(email: string, password: string) {
    const body = {
      email: email,
      password: password
    };

    return this.http.post<string>(this.HOST_URL + this.API + "/login", body,
      {responseType: 'text' as 'json'}).pipe(
      finalize(() => {
        this.loading.set(false);
        this.loggedIn.set(true);
      }));

  }

  register(payload: RegisterDto) {
    return this.http.post<void>(this.HOST_URL + this.API + "/register", payload).pipe(
      finalize(() => this.loading.set(false)));
  }

  logout() {
    localStorage.removeItem('token');
  }
}
