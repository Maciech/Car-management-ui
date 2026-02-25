import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Sidebar} from '../sidebar/sidebar';
import {Topbar} from '../topbar/topbar';
import {ToastComponent} from '../../../shared/ui/toast-component/toast-component';
import {AuthService} from '../../../features/auth/auth-service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar, Topbar, ToastComponent],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
    auth = inject(AuthService);
}
