import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {InviteService, InvitationInfo} from './invite-service';
import {AuthService} from '../auth/auth-service';

@Component({
  selector: 'app-invite-page',
  imports: [RouterLink],
  templateUrl: './invite-page.html',
  styleUrl: './invite-page.css',
})
export class InvitePage implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private inviteService = inject(InviteService);
  private authService   = inject(AuthService);

  token = signal('');
  invitation = signal<InvitationInfo | null>(null);
  state = signal<'loading' | 'ready' | 'accepting' | 'accepted' | 'error' | 'expired'>('loading');

  ngOnInit() {
    const t = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.token.set(t);

    if (!t) { this.state.set('error'); return; }

    this.inviteService.getInvitation(t).subscribe({
      next: inv => {
        this.invitation.set(inv);
        if (inv.status === 'ACCEPTED') { this.state.set('accepted'); return; }
        // If user is already logged in → auto-accept
        if (this.authService.isLoggedIn()) {
          this.accept();
        } else {
          this.state.set('ready');
        }
      },
      error: () => this.state.set('error'),
    });
  }

  accept() {
    this.state.set('accepting');
    this.inviteService.acceptInvitation(this.token()).subscribe({
      next: () => { this.state.set('accepted'); setTimeout(() => this.router.navigate(['/dashboard']), 1500); },
      error: () => this.state.set('error'),
    });
  }

  loginUrl() { return `/login?token=${this.token()}`; }
  registerUrl() { return `/register?token=${this.token()}`; }
}
