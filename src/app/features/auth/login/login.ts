import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth-service';
import {FormsModule} from '@angular/forms';
import {tap, switchMap, of} from 'rxjs';
import {InviteService} from '../../invite/invite-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [FormsModule, RouterLink],
  styleUrl: './login.css'
})
export class Login {
  private auth          = inject(AuthService);
  private router        = inject(Router);
  private route         = inject(ActivatedRoute);
  private inviteService = inject(InviteService);

  email    = '';
  password = '';
  error    = '';

  login() {
    this.error = '';
    const token = this.route.snapshot.queryParamMap.get('token');

    this.auth.login(this.email, this.password).pipe(
      tap(jwt => localStorage.setItem('token', jwt)),
      switchMap(() => token ? this.inviteService.acceptInvitation(token) : of(null))
    ).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => { this.error = 'Nieprawidłowy e-mail lub hasło.'; },
    });
  }
}
