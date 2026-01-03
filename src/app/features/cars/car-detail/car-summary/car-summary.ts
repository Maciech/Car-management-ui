import {Component, Input} from '@angular/core';
import {Car} from '../../car-model';

@Component({
  selector: 'app-car-summary',
  imports: [],
  templateUrl: './car-summary.html',
  styleUrl: './car-summary.css',
})
export class CarSummary {
  @Input() car!: Car;

}
