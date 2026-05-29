export interface PortfolioStatistics {
  totalCars: number;
  activeCars: number;
  soldCars: number;
  totalInvestedInActive: number;
  soldRevenue: number;
  totalProfit: number;
  carsByStatus: Record<string, number>;
}
