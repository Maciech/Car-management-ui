import {Component, Input, signal} from '@angular/core';
import {CostsTab} from './costs-tab/costs-tab';
import {ProfitTab} from './profit-tab/profit-tab';
import {InvitationsTab} from './invitations-tab/invitations-tab';

@Component({
  selector: 'app-car-tabs',
  imports: [CostsTab, ProfitTab, InvitationsTab],
  templateUrl: './car-tabs.html',
  styleUrl: './car-tabs.css',
})
export class CarTabs {
  view = signal<'costs' | 'profit' | 'history' | 'invitations'>('costs');
  @Input() carId!: number;
  @Input() carName = '';
}
