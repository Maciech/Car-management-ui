import {Component, Input, signal} from '@angular/core';
import {CostsTab} from './costs-tab/costs-tab';
import {ProfitTab} from './profit-tab/profit-tab';

@Component({
  selector: 'app-car-tabs',
  imports: [CostsTab, ProfitTab],
  templateUrl: './car-tabs.html',
  styleUrl: './car-tabs.css',
})
export class CarTabs {
  view = signal<'costs' | 'profit' | 'history'>('costs');
  @Input() carId!: number;
}
