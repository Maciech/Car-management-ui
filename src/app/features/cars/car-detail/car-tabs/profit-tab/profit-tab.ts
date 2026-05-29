import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {CarService} from '../../../car-service';
import {FinancialSummary} from './financial-summary.model';
import {CurrencyPipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-profit-tab',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './profit-tab.html',
  styleUrl: './profit-tab.css',
})
export class ProfitTab implements OnInit {
  @Input() carId!: number;

  private carService = inject(CarService);

  summary = signal<FinancialSummary | null>(null);
  loading = signal(true);
  error = signal(false);

  ngOnInit() {
    this.carService.getFinancialSummary(this.carId).subscribe({
      next: (s) => {
        this.summary.set(s);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  get roiFormatted(): string {
    const s = this.summary();
    if (!s || s.roi == null) return '—';
    return s.roi.toFixed(1) + '%';
  }

  get profitClass(): string {
    const s = this.summary();
    if (!s || s.profit == null) return '';
    return s.profit >= 0 ? 'positive' : 'negative';
  }
}
