import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  counter = signal(0);

  increment() {
    this.counter.update(v => v + 1);
  }
}
