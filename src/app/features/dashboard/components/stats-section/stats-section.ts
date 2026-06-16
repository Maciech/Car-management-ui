import {Component, computed, OnInit, signal} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {StatisticsService} from '../../statistics-service';
import {PortfolioStatistics} from '../../statistics.model';

@Component({
  selector: 'app-stats-section',
  imports: [CurrencyPipe],
  templateUrl: './stats-section.html',
  styleUrl: './stats-section.css',
})
export class StatsSection implements OnInit {
  stats   = signal<PortfolioStatistics | null>(null);
  loading = signal(true);

  // computed() — Angular wie kiedy przelicza wartość, brak NG0100
  profitClass = computed(() => {
    const s = this.stats();
    if (!s) return '';
    return s.totalProfit >= 0 ? 'profit' : 'loss';
  });

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit() {
    this.statisticsService.getPortfolioStatistics().subscribe({
      next: s => {
        this.stats.set(s);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
