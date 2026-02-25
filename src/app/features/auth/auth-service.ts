import {inject, Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {finalize} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API = '/api';
  private readonly HOST_URL = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  private loggedIn = signal<boolean>(false);
  private loading = signal(false);

  isLoggedIn() {
    return this.loggedIn();
  }

  login(email: string, password: string) {
    const body = {
      email: email,
      password: password
    };

    return this.http.post<void>(this.HOST_URL + this.API + "/login", body).pipe(
      finalize(() => {
        this.loading.set(false);
        this.loggedIn.set(true);
      }));

  }

  register(email: string, password: string) {
    const body = {
      email: email,
      password: password
    };
    return this.http.post<void>(this.HOST_URL + this.API + "/register", body).pipe(
      finalize(() => this.loading.set(false)));
  }

  logout() {
    this.loggedIn.set(false);
  }
}
