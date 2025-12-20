import {Component, signal} from '@angular/core';

type Range = 'year' | 'month' | 'custom';

@Component({
  selector: 'app-stats-section',
  imports: [],
  templateUrl: './stats-section.html',
  styleUrl: './stats-section.css',
})
export class StatsSection {
  range = signal<Range>('year');

  setRange(r: Range) {
    this.range.set(r);
  }

}
