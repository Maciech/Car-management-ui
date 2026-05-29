import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Sidebar} from '../sidebar/sidebar';
import {Topbar} from '../topbar/topbar';
import {ToastComponent} from '../../../shared/ui/toast-component/toast-component';
import {Layout} from '../layout';
import {CarService} from '../../../features/cars/car-service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar, Topbar, ToastComponent],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell implements OnInit {
  layout = inject(Layout);
  private carService = inject(CarService);

  ngOnInit() {
    // Preload makes once — all components use the cached signal instantly
    this.carService.loadMakes();
  }
}
