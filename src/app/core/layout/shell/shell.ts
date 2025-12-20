import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Sidebar} from '../sidebar/sidebar';
import {Topbar} from '../topbar/topbar';
import {ToastComponent} from '../../../shared/ui/toast-component/toast-component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar, Topbar, ToastComponent],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {

}
