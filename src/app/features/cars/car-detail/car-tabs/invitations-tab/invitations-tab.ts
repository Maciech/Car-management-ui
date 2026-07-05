import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InvitationService} from './invitation-service';
import {Invitation} from './invitation.model';

@Component({
  selector: 'app-invitations-tab',
  imports: [FormsModule],
  templateUrl: './invitations-tab.html',
  styleUrl: './invitations-tab.css',
})
export class InvitationsTab implements OnInit {
  @Input() carId!: number;
  @Input() carName = '';

  private service = inject(InvitationService);

  invitations = signal<Invitation[]>([]);
  sending     = signal<number | null>(null);
  sent        = signal<number | null>(null);

  newEmail    = '';
  inviting    = signal(false);
  inviteError = signal('');
  inviteSent  = signal(false);

  ngOnInit() { this.load(); }

  load() {
    this.service.getByCarId(this.carId).subscribe({
      next: list => this.invitations.set(list),
    });
  }

  invite() {
    const email = this.newEmail.trim();
    if (!email) return;
    this.inviting.set(true);
    this.inviteError.set('');
    this.inviteSent.set(false);

    this.service.invite(this.carId, this.carName, [email]).subscribe({
      next: () => {
        this.inviting.set(false);
        this.inviteSent.set(true);
        this.newEmail = '';
        this.load();
        setTimeout(() => this.inviteSent.set(false), 3000);
      },
      error: () => {
        this.inviting.set(false);
        this.inviteError.set('Nie udało się wysłać zaproszenia.');
      },
    });
  }

  resend(inv: Invitation) {
    this.sending.set(inv.invitationId);
    this.sent.set(null);
    this.service.resend(inv.invitationId).subscribe({
      next: () => {
        this.sending.set(null);
        this.sent.set(inv.invitationId);
        this.load();
        setTimeout(() => this.sent.set(null), 3000);
      },
      error: () => this.sending.set(null),
    });
  }

  statusLabel(status: string): string {
    return status === 'ACCEPTED' ? 'Zaakceptowane'
         : status === 'EXPIRED'  ? 'Wygasłe'
         : 'Oczekujące';
  }
}
